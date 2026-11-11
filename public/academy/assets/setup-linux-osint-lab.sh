#!/usr/bin/env bash
# Creates harmless training data only. Does not install software, access the network,
# change system settings, remove files, or attack any host.
set -euo pipefail
ROOT="${PWD}/oj-nexus-linux-osint-lab"
if [ -e "$ROOT" ]; then
  echo "Refusing to overwrite an existing lab folder: $ROOT" >&2
  exit 1
fi
mkdir -p "$ROOT/evidence" "$ROOT/records" "$ROOT/osint"
cat > "$ROOT/README.txt" <<'OJ_LAB_FILE_0'
OJ NEXUS SEC Linux & OSINT training dataset
MODE: local, authorized, offline
MARKER: NEXUS-LAB-READY
Evidence files are fictional and use reserved sample addresses.
Practice with pwd, ls, cat, grep, head, tail, wc, file and sha256sum.
OSINT .test domains are offline snapshots, not live DNS targets.
OJ_LAB_FILE_0
cat > "$ROOT/evidence/auth.log" <<'OJ_LAB_FILE_1'
09:08 user=staff4 ip=192.0.2.45 event=SUCCESS
09:10 user=learner17 ip=192.0.2.19 event=FAILED
09:11 user=learner17 ip=192.0.2.19 event=FAILED
09:12 user=learner17 ip=192.0.2.19 event=FAILED
09:13 user=learner17 ip=192.0.2.19 event=RATE_LIMITED
OJ_LAB_FILE_1
cat > "$ROOT/evidence/access.log" <<'OJ_LAB_FILE_2'
09:20 user=learner17 GET /api/profile/17 status=200
09:21 user=learner17 GET /api/staff/gradebook status=200
09:22 user=staff4 GET /api/staff/gradebook status=200
09:23 user=learner17 GET /api/staff/gradebook status=403 decision=DENY
09:24 user=learner17 GET /api/profile/17 status=200
OJ_LAB_FILE_2
cat > "$ROOT/evidence/config.txt" <<'OJ_LAB_FILE_3'
ALLOW_GUEST=false
AUDIT_LOG=true
OJ_LAB_FILE_3
cat > "$ROOT/evidence/integrity.txt" <<'OJ_LAB_FILE_4'
CONTROL_STATUS=APPROVED
POLICY=least-privilege
REVIEW_DATE=2026-11-01
OJ_LAB_FILE_4
cat > "$ROOT/records/hosts.csv" <<'OJ_LAB_FILE_5'
host,role,zone
learner-pc,student,student-wifi
portal-vm,web,learning
staff-vm,staff,administration
log-vm,monitor,learning
OJ_LAB_FILE_5
cat > "$ROOT/osint/dns.txt" <<'OJ_LAB_FILE_6'
zone=campus.test
A campus.test 198.51.100.20
MX campus.test mail.campus.test.
TXT campus.test "v=spf1 -all"
NS campus.test ns1.campus.test.
These records are fictional, not actual public DNS.
OJ_LAB_FILE_6
cat > "$ROOT/osint/whois.txt" <<'OJ_LAB_FILE_7'
Domain Name: CAMPUS.TEST
Registrar: OJ Academy Fictional Registry
Registrant Organization: OJ Academy Training Organization
Registration Status: training-only
Nameserver: ns1.campus.test
OJ_LAB_FILE_7
cat > "$ROOT/osint/headers.txt" <<'OJ_LAB_FILE_8'
HTTP/2 200
Content-Type: text/html; charset=utf-8
Server: TrainingServer
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
OJ_LAB_FILE_8
cat > "$ROOT/osint/robots.txt" <<'OJ_LAB_FILE_9'
User-agent: *
Disallow: /training-archive/
Allow: /
Note: robots.txt is NOT an access control system.
OJ_LAB_FILE_9
cat > "$ROOT/osint/site.txt" <<'OJ_LAB_FILE_10'
OJ Academy Campus (fictional)
Public information page
Contact: help@campus.test
Terms: training-only
OJ_LAB_FILE_10
cat > "$ROOT/osint/ct.txt" <<'OJ_LAB_FILE_11'
2026-03-04 portal.campus.test
2026-03-05 mail.campus.test
2026-04-02 docs.campus.test
Synthetic certificate-transparency export
OJ_LAB_FILE_11
cat > "$ROOT/osint/history.txt" <<'OJ_LAB_FILE_12'
Archive snapshot: 2026-04-18
Earlier public contact: security@campus.test
Change note: support page updated
All details are fabricated for this room.
OJ_LAB_FILE_12
cat > "$ROOT/osint/email-headers.txt" <<'OJ_LAB_FILE_13'
From: Campus IT <alerts@campus-alerts.test>
To: learner@campus.test
Reply-To: helpdesk@support-campus.test
Authentication-Results: training-mx; spf=fail; dkim=none
Received: from 192.0.2.42 by training-mx.campus.test
Subject: Please verify this unexpected request independently
OJ_LAB_FILE_13
cat > "$ROOT/osint/photo-metadata.txt" <<'OJ_LAB_FILE_14'
File Name: campus-photo.jpg
Creator: Academy Training Team
GPS Position: redacted
License: CC0
Published: 2026-02-14
Location: fictional training campus
OJ_LAB_FILE_14
cat > "$ROOT/osint/privacy-checklist.txt" <<'OJ_LAB_FILE_15'
source=training-gallery
consent=not-required-fabricated
share=aggregated-only
geolocation=redacted
OJ_LAB_FILE_15
echo "Training data created: $ROOT"
echo 'Next: cd oj-nexus-linux-osint-lab'
echo 'Try: pwd; ls -la; cat README.txt; grep FAILED evidence/auth.log'
echo 'All domains and addresses in the evidence files are fictional training examples.'
