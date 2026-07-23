# Stage 1 Solve Writeup: Undocumented Legacy Endpoint

## Description
Stage 1 introduces an undocumented legacy endpoint `/api/v1/health` that is not referenced in the frontend application or documented in the primary public API specifications. A user can discover this path only by guessing URLs, performing manual exploration, or running directory/API path brute-forcing utilities (like `gobuster`, `ffuf`, `dirb`, or `wfuzz`).

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
3. Access `http://localhost:8000/api/v1/health` via `curl` or browser:
   ```bash
   curl http://localhost:8000/api/v1/health
   ```
4. Extract the leaked flag from the response JSON body:
   ```json
   {
     "status": "ok",
     "service": "inbanaturals-api",
     "version": "1.0.4-legacy",
     "internal_flag": "STAGE1_FLAG_<random_hex>",
     "debug_mode": true
   }
   ```

5. Trigger progression reporting to the CTF coordinator by supplying the session parameter:
   ```bash
   curl "http://localhost:8000/api/v1/health?session=<session_id>"
   ```
   This automatically triggers a signed HMAC-SHA256 webhook to the platform Coordinator to unlock Stage 2.
