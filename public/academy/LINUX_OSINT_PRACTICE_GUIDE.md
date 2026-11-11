# OJ // NEXUS SEC Academy — Linux & OSINT Practice Guide

This guide accompanies **Linux & OSINT Practical Rooms** in the academy. Sign in, open `linux-osint.html`, select a room, follow its tutorial, type the command, and answer the evidence question. Ten rooms contain 40 command-driven questions.

## Two practice modes

**Browser mode:** The academy offers an offline command interpreter that accepts ordinary syntax for selected read-only Linux tools (for example `ls`, `grep`, `sha256sum`, `dig`, `whois`, and `curl -I`). Its file content and OSINT responses are fictional. It is not a Linux shell.

**Real Linux mode:** Download [setup-linux-osint-lab.sh](assets/setup-linux-osint-lab.sh). Inspect its text before executing it, then open a Linux/WSL terminal in the folder containing the downloaded script and run:

```bash
bash setup-linux-osint-lab.sh
cd oj-nexus-linux-osint-lab
pwd
ls -la
cat README.txt
grep FAILED evidence/auth.log
grep -c FAILED evidence/auth.log
tail -n 1 evidence/auth.log
wc -l evidence/access.log
file evidence/config.txt
sha256sum evidence/config.txt
```

The setup script creates a NEW `oj-nexus-linux-osint-lab` folder with 19 harmless fictional evidence files. It refuses to overwrite an existing lab folder. It does not install packages, configure services, scan networks, or execute attack code. Commands on your own Linux computer may have different paths and produce different results from the browser's simulated computer.

### Linux rooms

1. **Terminal Foundations:** `pwd`, `ls -la`, `cat README.txt`, `find . -name '*.log'`. Learn location, files and evidence discovery.
2. **Failed Login Investigation:** `grep FAILED evidence/auth.log`, `grep -c FAILED evidence/auth.log`, `tail -n 1 evidence/auth.log`. Discover who failed sign-in, where the events came from, and whether rate limiting responded.
3. **Web Access Log Triage:** `head -n 1 evidence/access.log`, `grep gradebook evidence/access.log`, `grep DENY evidence/access.log`, `wc -l evidence/access.log`. Learn to distinguish an allowed request from a forbidden request.
4. **Processes and Ports:** The browser simulates `whoami`, `ps aux`, `ss -tuln`, and `ip addr`. On a real Linux host these commands describe YOUR OWN machine, so the output will differ. To examine the same fictional snapshots locally, use `cat records/processes.txt`, `cat records/listening-ports.txt`, and `cat records/interface.txt`.
5. **Configuration Integrity:** Use `cat`, `file`, `sha256sum` and `grep` against `evidence/config.txt`. Hashes are fingerprints for comparing contents, not proof that something is trustworthy.

### OSINT rooms

OSINT (open-source intelligence) means interpreting information that is publicly available or properly authorized. Training data here concerns only a fabricated organization at `campus.test` and fictional documentation IP addresses.

6. **DNS Records:** Browser examples: `dig campus.test MX`, `dig campus.test TXT`, `dig campus.test NS`, `nslookup campus.test`. In the real downloaded dataset, inspect `osint/dns.txt` instead; `.test` is reserved and will not produce the fictional DNS records on the public Internet.
7. **WHOIS and Web Headers:** Browser examples: `whois campus.test`, `curl -I https://campus.test`, `curl -s https://campus.test/robots.txt`. For offline Linux practice, read `osint/whois.txt`, `osint/headers.txt`, `osint/robots.txt`, and `osint/site.txt`. Remember that `robots.txt` does not enforce access control.
8. **Certificates and Public Archives:** Inspect `osint/ct.txt` and `osint/history.txt` with `cat` and `grep`. Certificate names and archived contacts are clues that may be outdated, not proof a service is active.
9. **Email Header Verification:** Inspect `osint/email-headers.txt` for `From`, `Reply-To`, `Authentication-Results`, and `Received` entries. Compare findings to known channels; do not assume a single SPF failure proves malicious intent.
10. **Metadata and Privacy:** Read `osint/photo-metadata.txt` and `osint/privacy-checklist.txt`. This is an exported training text file, not a real photograph. Do not use metadata skills to identify or track private individuals.

### Optional harmless live practice

On your own Linux computer, if the tools are installed, you may use the public documentation domain `example.com` for basic passive DNS and HTTP header observation:

```bash
dig example.com
curl -I https://example.com
```

These are separate from the fictional answers in the website, and actual network replies may vary. The academy's browser interpreter never sends real DNS or HTTP requests.

## Training assessment

Each room requires executing its four example commands in the browser, interpreting the output, entering four correct answers, completing a defensive knowledge check, and writing at least 60 characters of findings. Completion is saved to the learner's account in Supabase. The checks and flags are client-side exercises, not proctored or tamper-proof assessments.

## Important scope

Never run security tests against someone else's system without explicit permission. No password guessing, real exploit payloads, harmful binaries, personal-data lookup, or network scans are included in these exercises.
