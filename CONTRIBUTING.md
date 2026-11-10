# Contributing to NEXUS//SEC Academy

Thanks for helping improve the academy. Contributions should make cybersecurity learning clearer, safer, more accessible, and more practical.

## Before you start

- Read the [project guide](docs/PROJECT-GUIDE.md), [roadmap](docs/ROADMAP.md), and [Code of Conduct](CODE_OF_CONDUCT.md).
- For larger changes, open an issue first so the scope can be discussed.
- Never include personal information, passwords, API keys, private company data, or real authentication logs.

## Local setup

Requirements: Node.js 22 or later. The project has no third-party runtime dependencies.

```sh
npm start
```

Open `http://127.0.0.1:4173`.

Run the validation suite before opening a pull request:

```sh
npm run check
```

## Contribution guidelines

- Keep the interface responsive and keyboard accessible.
- Prefer plain JavaScript and browser APIs already used by the project; avoid adding dependencies without a clear reason.
- Keep tutorial examples factual, defensive, and appropriate for a beginner-to-intermediate learner.
- Keep practical labs and role simulations fictional and self-contained. Do not add instructions for attacking real systems, persistence, evasion, credential theft, or unauthorised access.
- Label simulated evidence and simulated terminal output clearly.
- Preserve progress compatibility where possible; document any change to local-storage keys or saved data formats.
- Update documentation when navigation, setup, features, or limitations change.

## Pull requests

Use the pull request template. Keep each pull request focused, explain how you tested it, and include screenshots for substantial UI changes.
