#!/usr/bin/env python3
"""OJ Academy safe, offline Kali practice dataset and loopback-only HTTP service.
Requires only Python 3 standard library. Creates synthetic files and a four-packet PCAP.
No malware, credentials, scanning, active exploitation or remote connections.
"""
import argparse
import ipaddress
from pathlib import Path
import struct
import textwrap
import time

ROOT = Path.cwd() / "oj-kali-safe-lab"
FILES = {
    "SCOPE.txt": "OWNER=OJ Academy\nALLOWED_HOST=127.0.0.1\nALLOWED_PORT=8766\nOUT_OF_SCOPE=external-targets\nMODE=read-only and local-service observation\n",
    "evidence/auth.log": "09:08 user=staff4 event=SUCCESS\n09:10 user=learner17 event=FAILED\n09:11 user=learner17 event=FAILED\n09:12 user=learner17 event=FAILED\n09:13 user=learner17 event=RATE_LIMITED\n",
    "evidence/notice.txt": "MARKER=NEXUS-TRAINING\nCLASSIFICATION=synthetic\nOWNER=OJ Academy\n",
    "evidence/request.http": "GET /api/private HTTP/1.1\nHost: 127.0.0.1:8766\nUser-Agent: TrainingBrowser\nAccept: application/json\n",
    "evidence/response.http": 'HTTP/1.1 403 Forbidden\nContent-Type: application/json\n\n{"error":"forbidden"}\n',
    "evidence/conn.log": "ts=09:01 id.orig_h=127.0.0.1 id.resp_h=127.0.0.1 id.resp_p=8766 service=http\n",
    "evidence/alerts.json": '{"alerts":[{"rule":"TRAINING_LOGIN_BURST","severity":"medium","source":"synthetic"}]}\n',
    "reports/web-observations.txt": "CONTROL=server-side authorization\nEVIDENCE=403 returned by /api/private\n",
    "reports/zap-passive.txt": "SAMPLE PASSIVE FINDING: X-Frame-Options not set\nRISK=LOW\nFIX=Use CSP frame-ancestors for modern frame embedding restrictions\nNOTE=Verify whether the alternative CSP already mitigates the observation\n",
    "reports/suricata-alerts.txt": "rule=TRAINING_LOGIN_BURST\nclassification=authentication-anomaly\nseverity=medium\nACTION=verify-session\n",
    "reports/control-matrix.txt": "MFA=enabled\nRATE_LIMIT=enabled\nWIFI=WPA3\nPATCHING=approved\nAUDIT=enabled\n",
    "reports/findings.csv": "id,asset,severity,summary\nOJ-001,127.0.0.1:8766,low,Missing legacy X-Frame-Options header; CSP frame-ancestors present\n",
    "reports/remediation.txt": "OWNER=Web Platform\nVERIFY=retest\n",
    "osint/dns.txt": "campus.test MX mail.campus.test\ncampus.test TXT v=spf1 -all\ncampus.test NS ns1.campus.test\nNote: CAMPUS.TEST is fictional and is not a live DNS target.\n",
    "osint/whois.txt": "Domain Name: CAMPUS.TEST\nRegistrar: OJ Academy Registry\nStatus: fictional reserved domain\n",
    "README.txt": "OJ NEXUS SEC Academy - Kali Safe Lab\nOWNER=OJ Academy\nThe local HTTP service listens ONLY on 127.0.0.1:8766.\nAll captures, logs, and alerts contain fictional data.\nNo attack tools, malware, credential attacks or external scanning are included.\n"
}

LOCAL_SERVER = '''#!/usr/bin/env python3
"""Loopback-only read-only OJ training service."""
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.respond(False)

    def do_HEAD(self):
        self.respond(True)

    def respond(self, head_only):
        path = self.path.split("?", 1)[0]
        if path in ("/", "/training"):
            status, content_type, body = 200, "text/html; charset=utf-8", (
                b"<!doctype html><html><head><title>OJ Training</title></head>"
                b"<body><h1>OJ Loopback Training Site</h1>"
                b"<p>Fictional test service. Read-only endpoints only.</p>"
                b"</body></html>")
        elif path == "/robots.txt":
            status, content_type, body = 200, "text/plain; charset=utf-8", (
                b"User-agent: *\\nDisallow: /private/\\n"
                b"Note: robots.txt is not an access control rule.\\n")
        elif path == "/api/profile/17":
            status, content_type, body = 200, "application/json", json.dumps({
                "id": "17", "name": "Example Learner",
                "scope": "fictional public test profile"
            }).encode("utf-8")
        elif path == "/api/private" or path.startswith("/private/"):
            status, content_type, body = 403, "application/json", (
                b'{"error":"forbidden","message":"Access is denied by server-side policy"}')
        else:
            status, content_type, body = 404, "application/json", b'{"error":"not_found"}'
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Security-Policy",
                         "default-src 'self'; frame-ancestors 'self'")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if not head_only:
            self.wfile.write(body)

if __name__ == "__main__":
    server = HTTPServer(("127.0.0.1", 8766), Handler)
    print("OJ Kali Safe Lab at http://127.0.0.1:8766")
    print("Only your own computer can connect. Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
'''

def checksum(data):
    if len(data) % 2:
        data += b"\0"
    words = struct.unpack("!" + "H" * (len(data)//2), data)
    total = sum(words)
    while total >> 16:
        total = (total & 0xffff) + (total >> 16)
    return (~total) & 0xffff

def ipv4(src, dst, proto, body, ident):
    source = ipaddress.IPv4Address(src).packed
    target = ipaddress.IPv4Address(dst).packed
    header = struct.pack("!BBHHHBBH4s4s", 0x45, 0, 20+len(body),
                         ident, 0, 64, proto, 0, source, target)
    header = header[:10] + struct.pack("!H", checksum(header)) + header[12:]
    ethernet = bytes.fromhex("0200000000020200000000010800")
    return ethernet + header + body

def udp(srcport, dstport, body):
    return struct.pack("!HHHH", srcport, dstport, len(body)+8, 0) + body

def tcp(srcport, dstport, body, flags, seq=1, ack=0):
    # The synthetic packet does not target a real service; we store it offline.
    return struct.pack("!HHIIHHHH", srcport, dstport, seq, ack, (5 << 12)|flags,
                       8192, 0, 0) + body

def make_pcap(path):
    name = b"\x06campus\x04test\x00"
    question = name + struct.pack("!HH", 1, 1)
    dns_query = struct.pack("!HHHHHH", 0x0042, 0x0100, 1, 0, 0, 0) + question
    dns_reply = (struct.pack("!HHHHHH", 0x0042, 0x8180, 1, 1, 0, 0) + question
                 + b"\xc0\x0c" + struct.pack("!HHIH", 1, 1, 60, 4)
                 + ipaddress.IPv4Address("198.51.100.20").packed)
    payload = b"GET /training HTTP/1.1\r\nHost: 127.0.0.1:8766\r\n\r\n"
    packets = [
        ipv4("192.0.2.25", "198.51.100.53", 17,
             udp(53100, 53, dns_query), 1),
        ipv4("198.51.100.53", "192.0.2.25", 17,
             udp(53, 53100, dns_reply), 2),
        ipv4("127.0.0.1", "127.0.0.1", 6,
             tcp(55321, 8766, b"", 2), 3),
        ipv4("127.0.0.1", "127.0.0.1", 6,
             tcp(55321, 8766, payload, 0x18, seq=2, ack=1), 4),
    ]
    with path.open("wb") as out:
        out.write(struct.pack("<IHHIIII", 0xa1b2c3d4, 2, 4, 0, 0, 65535, 1))
        for i, packet in enumerate(packets):
            out.write(struct.pack("<IIII", 1700000000 + i, 0,
                                  len(packet), len(packet)))
            out.write(packet)

def setup():
    try:
        ROOT.mkdir()
    except FileExistsError:
        raise SystemExit("Refusing to overwrite existing directory: " + str(ROOT))
    for name, body in FILES.items():
        path = ROOT / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(body, encoding="utf-8")
    server = ROOT / "serve.py"
    server.write_text(LOCAL_SERVER, encoding="utf-8")
    capture = ROOT / "captures" / "campus-demo.pcap"
    capture.parent.mkdir(parents=True, exist_ok=True)
    make_pcap(capture)
    print("Created 16 synthetic evidence files, a four-packet capture and serve.py")
    print("Folder: " + str(ROOT))
    print("Next: cd oj-kali-safe-lab")
    print("Then: python3 serve.py")
    print("In another terminal: curl -I http://127.0.0.1:8766")
    print("No external network scanning or attack traffic is required.")

def main():
    parser = argparse.ArgumentParser(description="Build the OJ Academy Kali Safe Lab")
    parser.add_argument("--setup", action="store_true",
                        help="Create a new local, harmless lab folder")
    args = parser.parse_args()
    if args.setup:
        setup()
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
