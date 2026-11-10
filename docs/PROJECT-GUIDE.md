# NEXUS//SEC Academy — Project Guide

## Purpose

A self-contained cybersecurity learning website for beginners through intermediate learners. It combines a public landing page with an in-browser academy. All command execution and incident data are simulated; the project does not provide a shell on the host computer or connect to target systems.

## Main areas

- Dashboard and guided start path
- Eight-stage curriculum and searchable tutorial library
- Dedicated tutorial pages with objectives and knowledge checks
- Simulated terminal for SSH log investigation and Linux permissions
- Scenario-based practical labs
- 100-entry defensive attack-pattern field guide
- 32 CTF-style puzzles using synthetic evidence
- Nine role-based live incident simulations
- Graded assessment and career role tracks
- Browser-local progress tracking and export

## Source layout

```text
index.html                       Public landing page
academy/                         Academy pages
  assets/app.js                  Core content, navigation, labs, terminal and progress logic
  assets/expansion.js            Attack library, CTFs and role-range scenarios
  assets/style.css               Academy theme and responsive layout
  *.html                         Route entry pages
scripts/check-project.js         Lightweight project and content checks
server.js                        Dependency-free local preview server
docs/                            Project, GitHub and roadmap documentation
.github/workflows/               Validation and GitHub Pages workflows
```

## Run locally

Requirements: Node.js 22 or later.

```sh
npm start
```

Then open `http://127.0.0.1:4173`.

You can also open `index.html` directly in a modern browser. The local server is recommended for consistent routing and asset loading.

## Validate

```sh
npm run check
```

## Progress and privacy

Progress is stored in the browser's `localStorage` on the current device/browser profile. Clearing site data removes it. There are no student accounts, server database, cross-device sync, instructor portal, or server-side certificate validation in this version. Do not enter real passwords, personal data, or confidential company logs into training exercises.

## Terminal simulator

The terminal uses a small fictional file system implemented in JavaScript. It supports a teaching subset of commands such as `help`, `pwd`, `whoami`, `ls`, `cat`, `grep`, `wc`, `head`, `tail`, `sort`, `uniq`, `awk` (limited source-IP extraction), `chmod`, `stat`, `history`, and simple pipelines. It does not execute operating-system commands. The SSH case data is fictional and uses documentation IP ranges.

Example investigation:

```sh
grep "Failed" auth.log
grep "Failed" auth.log | awk '{for(i=1;i<=NF;i++) if($i=="from") print $(i+1)}' | sort | uniq -c | sort -nr
ls -l backup.sh
chmod 750 backup.sh
```

## Safe learning boundary

All labs are designed as isolated scenarios and fictional datasets. Use real tools only on systems you own or where you have explicit written authorisation and a clearly defined scope. The content focuses on defensive analysis, secure configuration, reporting and responsible testing.

## GitHub Pages deployment

Follow [GITHUB-SETUP.md](GITHUB-SETUP.md). The static site is deployed by the included GitHub Actions workflow from the `main` branch. No framework build step is needed.

## Expanded defensive learning modules

### Attack Library

Open `academy/attacks.html` for 100 common attack patterns. The library is organised by category and searchable. Each pattern includes a high-level explanation, defender telemetry clues, an incident-response perspective and prevention controls. It intentionally avoids live exploit payloads and instructions for attacking real systems.

### Live Role Range

Open `academy/range.html`, choose one of nine cyber roles and start a scenario. Seven synthetic telemetry events stream into the workbench at a configurable pace. Each role has four workflow decisions that unlock as events arrive, a read-only investigation console, case notes and a structured report. Completed role simulations are stored with local progress.

The range console accepts only read-only commands: `help`, `alerts`, `evidence`, `timeline`, `search WORD`, `count source-ip`, `assets` and `case`. All event data uses fictional assets and reserved example domains/IP addresses. No attack is executed; the app simulates the evidence a defender would see.

### CTF expansion

The CTF page contains 32 synthetic challenges spanning identity, email, cloud, Windows, Linux, network telemetry, forensics, API security, vulnerability prioritisation and reporting. Flags are client-side learning checks, not secure competition secrets.
