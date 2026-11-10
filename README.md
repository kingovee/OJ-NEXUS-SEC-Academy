# OJ // NEXUS SEC Academy — v2.0 Final Public Beta

**OJ-branded, educational browser-only cyber range** featuring 100 defensive attack tutorials, 32 fictional CTF challenges and nine role-based incident simulations.

## Quick start

Requires Node.js 22+.

```bash
npm start
```

Visit http://127.0.0.1:4173.

```bash
npm run check
```

## Hosting on GitHub Pages

The deployment workflow publishes **only `public/`**. In repository Settings → Pages, choose **GitHub Actions**.

## Learning flow

1. Start with **Start Here** for foundations.
2. Read tutorials and practise with synthetic evidence in Labs.
3. Explore CTF challenges.
4. Run a role simulation (SOC, DFIR, cloud, AppSec and others).
5. Export progress or a case report.

## Security and privacy

There are **no accounts, no admin panel and no backend** in this beta. Student progress and case notes remain in the current browser. Use **My Progress → Reset all local progress** to clear them. Do not paste real secrets or personal information. Read [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md).

The terminal is an **isolated command simulator**, not a real shell. Incident events stream on a timer from fictional datasets; no real attack is executed. Client-side CTF answers are for practice only.

## Development

Source website: `public/` · server: `server.js` · validation: `scripts/check-project.js` · automated tests: `tests/`.

This is a beta; real-user browser testing and accessibility audits are still recommended before claiming production readiness.

# OJ // NEXUS SEC Academy

A browser-based cybersecurity learning academy with structured tutorials, safe practical exercises, CTF-style puzzles, career tracks, and role-based incident simulations.

> **Learning project, not a production cyber range.** All terminal output, CTF evidence, attack examples, and incident timelines are simulated and fictional. The site does not run commands on the host computer, attack real systems, or connect to target networks.

## Features

- **Guided curriculum:** eight stages from IT foundations through defensive security and career specialisations.
- **Tutorial library:** structured lessons, examples, and knowledge checks.
- **100-pattern attack field guide:** defensive explanations, telemetry clues, response guidance, and prevention controls across ten categories.
- **Practical labs:** self-contained exercises using synthetic data.
- **32 CTF-style challenges:** fictional evidence and learning flags; answers are client-side and are not suitable for a competitive CTF service.
- **Live Role Range:** nine role simulations for SOC analysis, incident response, threat hunting, digital forensics, cloud security, application security, GRC, authorised security testing, and security architecture.
- **Simulated terminal:** a limited command set, fictional file system, command history, quoted `grep` patterns, and simple pipelines.
- **Progress tracking:** browser-local progress with export.
- **Career Centre:** role paths, skills, tool familiarity, and portfolio project suggestions.
- **GitHub Actions:** automatic source validation and GitHub Pages deployment from `main`.

## Quick start

Requirements: **Node.js 22 or later**. No third-party npm dependencies are required.

```sh
npm start
```

Open <http://127.0.0.1:4173> in your browser.

You can also open `index.html` directly, though the local server gives more consistent routing and asset loading.

## Validate the project

```sh
npm run check
```

The check script validates key project files, JavaScript syntax, core page wiring, local links, and the expected content structure (100 attack entries, 32 CTF challenges, and nine role simulations).

## Publish with GitHub Pages

See **[docs/GITHUB-SETUP.md](docs/GITHUB-SETUP.md)** for the exact repository setup and push commands.

After the files are pushed to the `main` branch:

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. The included `Deploy GitHub Pages` workflow validates the project and deploys the static website.
4. Find the published address in the workflow run or the Pages settings page.

The site uses relative links and does not require a build step.

## Project structure

```text
nexus-sec-academy/
├── index.html
├── academy/
│   ├── assets/                 # Application JS, expanded content, styles
│   └── *.html                  # Academy pages
├── docs/                       # Project guide, roadmap, GitHub setup
├── scripts/check-project.js    # Local and CI validation
├── .github/
│   ├── workflows/              # Validation and Pages deployment
│   ├── ISSUE_TEMPLATE/         # Structured bug and feature reports
│   └── PULL_REQUEST_TEMPLATE.md
├── server.js                   # Dependency-free local preview server
├── package.json
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── SUPPORT.md
└── LICENSE
```

## Data, privacy, and limitations

- Progress is saved in `localStorage` in the current browser profile. It does not sync across devices.
- There are no student accounts, server database, instructor portal, server-side grading, or verified certificates.
- CTF flags and front-end logic are visible in the browser source; this is for learning, not secure competition hosting.
- The role range streams scripted synthetic events. Its console searches only the scenario data and is read-only.
- Do not enter real passwords, API keys, personal information, confidential business records, or real authentication logs.

## Responsible learning

Use real security tools only in systems you own or where you have explicit written permission and a defined scope. Keep practice within authorised environments. The included simulations are designed to teach defensive reasoning, reporting, safe configuration, and responsible security work.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Please run `npm run check` before opening a pull request.

## Licence

MIT. See [LICENSE](LICENSE).


## Release limitations

The release is complete as a **static educational beta**, not a production LMS.
It does not offer authenticated accounts, instructor grading, real network access,
competitive server-side CTF validation, or accredited certificates. All incidents
and command outputs are fictional training data. Do not enter real credentials.

## Final pre-publish verification

1. Run `npm run check` locally.
2. Open the site on desktop and mobile browsers.
3. Finish the SSH terminal lab, one CTF and a complete SOC role simulation.
4. Confirm local progress persists after reload, then test progress export and reset.
5. Enable GitHub Pages (Actions) and confirm the deployed links work.

The CI workflow validates source structure and logic; manual visual/interaction
checks on actual devices remain advisable.
