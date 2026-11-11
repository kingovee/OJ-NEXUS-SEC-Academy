# OJ // NEXUS SEC — Kali Tool Academy

**Purpose:** teach students *which Kali tool to use, why, how to read evidence, and how to report defensive findings*. The GitHub Pages academy hosts **eight pathway stages, 41 tool reference entries and 13 guided practice rooms with 52 evidence questions**. It does **not** run Kali, Linux commands, or a remote attack lab in the browser.

Official references: [Kali tools](https://www.kali.org/tools/all-tools/), [Kali metapackages](https://www.kali.org/docs/general-use/metapackages/), [Kali top ten](https://www.kali.org/tools/kali-meta/), [Wireshark documentation](https://www.wireshark.org/docs/).

## 1. Choose the right tool

| Investigation objective | Use first | Why |
|---|---|---|
| Confirm authorization and preserve evidence | `cat`, `grep`, `sha256sum` | Check written scope and file integrity |
| Analyze public DNS and synthetic OSINT | `dig`, `whois`, `ExifTool` | Interpret records without invasive testing |
| Inventory **your own** lab service | `ss`, `Nmap` | Show a localhost listener and the approved port |
| Inspect web status and headers | `curl`, Burp Suite Proxy, OWASP ZAP passive features | Compare permitted requests and server-side denials |
| Analyze a saved traffic capture | Wireshark, `tshark`, `tcpdump` | Recognize DNS, TCP and HTTP evidence without intercepting traffic |
| Investigate an alert | `jq`, Suricata and Snort sample reports, YARA concepts | Correlate a finding with context |
| Review evidence and communicate fixes | GVM/OpenVAS report review, Faraday, Dradis | Record the issue, owner, evidence and retest |
| Learn what credential/exploitation tooling means | Metasploit, Hydra, John, Hashcat, sqlmap, Aircrack-ng | Awareness of risk, defensive controls, written-authorization requirements. **No operational attack commands included** |

This is a **curated learning catalog**, not literally every package Kali offers.

## 2. Start the real local Kali practice environment

Download [kali-safe-lab.py](assets/kali-safe-lab.py). **Read the script before running it**. It uses only Python 3's standard library and creates a brand-new `oj-kali-safe-lab` folder. It will refuse to overwrite an existing folder. It never downloads code, changes system configuration, scans external networks, or installs attack tools.

From a terminal on your own Kali Linux, Ubuntu or WSL system:

```bash
python3 kali-safe-lab.py --setup
cd oj-kali-safe-lab
python3 serve.py
```

The local training web service listens on **127.0.0.1:8766 only**. Leave that terminal running and open another terminal in the same `oj-kali-safe-lab` folder. Use Ctrl+C to stop the local service.

### Scope and evidence

```bash
cat SCOPE.txt
grep ALLOWED_PORT SCOPE.txt
grep FAILED evidence/auth.log
grep -c FAILED evidence/auth.log
sha256sum evidence/notice.txt
```

These commands use only files created by the lab setup script.

### Nmap: local port inventory

```bash
ss -tuln
nmap -sT -p 8766 127.0.0.1
```

The command is limited to the locally owned training HTTP service. Do **not** change the address to unrelated computers, campuses or public systems. If Nmap is not installed, use the saved evidence and `ss` lesson instead.

### curl: HTTP interpretation

```bash
curl -I http://127.0.0.1:8766
curl -i http://127.0.0.1:8766/api/profile/17
curl -i http://127.0.0.1:8766/api/private
curl -s http://127.0.0.1:8766/robots.txt
```

**Interpretation:** the profile route returns a fictional public test record; the private endpoint returns **403 Forbidden** enforced by the local server. `robots.txt` is not an access-control system.

### Burp Suite and OWASP ZAP: manual, passive analysis

Open your own localhost training site (`http://127.0.0.1:8766`) in your testing browser. Use Burp's HTTP history or ZAP's manual browsing/passive observation feature to inspect the response and confirm which status code and headers are present. Do not use Intruder, active scanning, automated guessing or public-site targets for this training exercise. A sample request and response is provided in `evidence/request.http` and `evidence/response.http`; a synthetic passive alert is in `reports/zap-passive.txt`.

### Wireshark, TShark and tcpdump: offline packet analysis

The setup creates a **four-packet synthetic PCAP**, with a fictional DNS exchange and a localhost HTTP request. The PCAP does not record or contact real devices. Open it in Wireshark:

```bash
wireshark captures/campus-demo.pcap
```

Useful Wireshark display filters: `dns`, `tcp`, and `http`. The HTTP service uses port 8766, so if Wireshark does not identify it automatically, select **Decode As → HTTP** for the port. For command-line inspection:

```bash
capinfos captures/campus-demo.pcap
tshark -r captures/campus-demo.pcap -Y dns
tshark -r captures/campus-demo.pcap -d tcp.port==8766,http -Y http
tcpdump -nn -r captures/campus-demo.pcap
```

**Never collect packet captures from other people's networks without explicit permission.**

### Alert and forensic review

```bash
cat evidence/alerts.json
jq '.alerts[0].rule' evidence/alerts.json
cat reports/suricata-alerts.txt
file evidence/notice.txt
strings evidence/notice.txt
sha256sum evidence/notice.txt
cat reports/findings.csv
```

All of these are harmless, locally generated files. No ransomware, exploit binaries, or password lists are included.

## 3. Offline versus live tools

Commands such as `dig campus.test MX` and `whois campus.test` in the website are **fictional offline previews**. `.test` is a reserved domain. To inspect the exact same data on your own Linux PC, read `osint/dns.txt` and `osint/whois.txt`. To learn how real `dig` looks using a reserved public example, you may inspect `dig example.com` on your own device and compare the format. Live responses will differ.

The browser exercises require entering a permitted training command, interpreting the returned synthetic evidence, answering four questions, passing an end-of-room knowledge check and writing a short report. The site saves completion to the learner's account through Supabase. Browser-based checks are educational and not tamper-proof exams.

## 4. Tool choice decision path

1. **Define authorized scope.** If permission is missing, do not proceed.
2. **Read passive information first.** Use the OSINT evidence before active service checks.
3. **Inventory your own localhost.** Identify the training service with `ss` and optionally Nmap.
4. **Inspect the web application.** Understand status codes and secure headers with `curl`, then passively inspect your own traffic using Burp or ZAP.
5. **Review packet evidence.** Use supplied PCAPs, not live captures of third parties.
6. **Triage detections.** Correlate logs, rules, and context; don't treat alerts as confirmed breaches.
7. **Understand misuse risks.** Password guessing, exploitation and Wi-Fi attack tooling have significant safety and legal implications; this academy teaches protective controls, not live instructions.
8. **Report findings with evidence and retest.** Correct status, observed behavior, scope, risk, owner, fix, and follow-up.

The `kali-linux-labs` metapackage lists deliberately vulnerable learning environments, but the GitHub Pages edition is **not** a virtual-machine hosting service. Students should practise only in their own approved isolated environments.

## 5. Practice tasks

Your students should explain, in their own words: what the tool was meant to establish; exactly what the evidence supports; what it does not prove; the relevant security control; and how to confirm remediation. Each of the thirteen rooms includes four evidence checkpoints plus a final knowledge check.

**No certificates, real credentials, exploit payloads, unrestricted shells or external attack automation are part of this module.**
