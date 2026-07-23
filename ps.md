# Problem Statement — PWNDORA Track T-05 SODE

## Vulnerability Chain Exploitation Lab

**Multi-Stage Web Attack Module for PWNDORA**

| Field | Detail |
|-------|--------|
| **Track** | T-05 SODE — SOC & Offensive Detection Engineering |
| **Difficulty** | Moderate-High (multi-vulnerability deliberate web-app design, server-side stage-gate enforcement, Docker sandboxing, exploit-chain logical validity) |
| **Tech Domain** | Web Application Penetration Testing, CTF Design, Docker, Python/Node.js/PHP, OWASP Top 10, Authentication Security, Exploit Chaining |
| **Deliverable** | A fully containerised deliberately-vulnerable web application where learners chain exactly 4 vulnerabilities in sequence to achieve full compromise, with automated server-side stage validation |

---

## Description

Most web security labs present vulnerabilities in isolation, but real penetration testing requires **chaining** — PWNDORA needs multi-stage chaining labs to build genuine methodology and advanced exploit reasoning.

Teams must build a deliberately vulnerable, sandboxed enterprise-style web application (e.g. HR portal, document management, inventory system) with exactly **4 chained vulnerabilities** that must be exploited in sequence to achieve full compromise.

---

## Objectives

- Build **one vulnerability from each of**:
  1. Authentication / Authorization flaw
  2. Injection vulnerability
  3. Server-side vulnerability (SSRF / XXE / Path Traversal)
  4. Privilege escalation or data exfiltration mechanism
- Design a **realistic fictional corporate application** — not an obviously fake training site
- Enforce **stage gates** so Stage N is only exploitable after Stage N-1 yields the required credential or token, in a chain that is technically logical
- Implement **server-side stage validation** that cannot be bypassed by client-side manipulation
- Build a **progress-tracker overlay** (Stage 1–4 status, time elapsed) with a hint system (max 3 hints/stage, point-costed)
- Build a **post-completion pentest report generator** with CVSS score per vulnerability, impact analysis, chaining narrative, and remediation per finding

---

## Judging Criteria

**Prototype-First, Presentation-Second**: the primary evaluation criterion is a **WORKING PoC/prototype** demonstrating the feature end-to-end. Judges will click, test, and break every submission.

| # | Criterion | Weight | What Judges Assess |
|---|-----------|--------|--------------------|
| 1 | **Working PoC / Prototype** | 40% | Features must be functional and demonstrable live. Non-working submissions score zero here. Code depth and engineering quality are evaluated in this category. |
| 2 | **PWNDORA Product Fit** | 20% | How naturally does the feature integrate into PWNDORA? Is the architecture compatible with a browser-native lab product? Would BlackPerl's product team consider it roadmap-ready? |
| 3 | **Innovation & Originality** | 20% | Uniqueness and creativity of approach. Does this solve a genuine PWNDORA gap? Does it go beyond surface-level implementations? |
| 4 | **Security by Design** | 10% | Security posture of the feature itself: authentication, input validation, sandboxing, data privacy. All submitted code must be secure by default. |
| 5 | **Documentation & Code Quality** | 10% | README clarity, architecture documentation, code organization, and ease of handoff to the BlackPerl engineering team. |

### Judging Panel Composition

- **Technical Judge (x2)** — BlackPerl DFIR product engineers who independently test prototypes against problem-statement requirements
- **Product Judge (x1)** — BlackPerl DFIR product management, evaluating PWNDORA integration fit and commercial viability
- **Domain Expert Judge (x1)** — BlackPerl DFIR domain specialist (DFIR/SOC/Red Team), evaluating technical accuracy and security correctness
- **Community Representative (x1)** — BrewingSec community lead, evaluating presentation clarity and community value

---

## Submission Requirements

**All submissions must be received by 06:00 PM – 07:00 PM on July 25, 2026 (Code Freeze).**

- GitHub/GitLab Repository (public or shared with all judges) — organized source code with a clear directory structure
- README.md — setup instructions, architecture overview, vulnerability documentation, and usage guide
- Working demo / walkthrough video or live environment access
- All dependencies clearly documented with containerization (Docker) preferred
