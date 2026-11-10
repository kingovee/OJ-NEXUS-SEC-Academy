# OJ // NEXUS SEC Academy — Final Beta Release Checklist

## Automated checks
- [x] JavaScript parses and the static link checker passes.
- [x] 100 attack patterns, 32 CTFs and 9 role simulations are present.
- [x] Unit and simulated workflow tests pass (SSH terminal, case handover, progress reset).
- [x] Local server blocks non-public project files.
- [x] GitHub Pages workflow publishes only `public/`.

## Before announcing a public launch
- [ ] Run `npm run check` on the machine you will use for publishing.
- [ ] Test the landing page and navigation on desktop and a real phone.
- [ ] Complete a CTF, the SSH terminal lab and one live SOC role simulation in a real browser.
- [ ] Test exporting a case report and progress JSON.
- [ ] Confirm saved progress persists after refresh and resets when requested.
- [ ] Enable Settings → Pages → GitHub Actions; check deployment URL and all routes.
- [ ] Add repository description, topics, screenshot and social preview image if desired.

## Scope and honesty
This is a complete static beta, **not** an authenticated learning management system.
All labs, CTFs, alerts, and incident streams use synthetic in-browser data.
CTF flags are inspectable client-side. No competitive rankings or accredited
certificates are offered. Progress is local to the current browser.
