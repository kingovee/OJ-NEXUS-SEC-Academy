# Product roadmap

## Included in this release

- Branded landing page and academy navigation
- Curriculum, tutorials, labs, CTFs, assessment and career tracks
- Simulated terminal and fictional authentication-log investigation
- 100-entry defensive attack-pattern field guide
- 32 synthetic CTF challenges
- Real-time scripted incident streams for nine role-based simulations
- Read-only investigation console, case notes, scoring and report export
- Local progress persistence and export
- Responsive dark cyber-console interface
- GitHub Actions validation and GitHub Pages deployment workflows

## Recommended next releases

1. **Content depth:** expand each lesson into prerequisites, concept explanations, worked examples, glossary, recap and references.
2. **Lab engine:** add resettable lab workspaces, hints, graded checkpoints and accessibility-friendly feedback.
3. **Backend:** add authenticated student accounts, secure session management, database-backed progress and role-based access control.
4. **Instructor tools:** cohort management, assignment publishing, grading rubrics and progress reports.
5. **Certificates:** issue verifiable completion records only after server-side validation.
6. **Real isolated labs:** integrate a separately hosted, disposable training environment with resource limits and strict network isolation.
7. **Quality:** automated browser tests, accessibility review, content review and security review before public launch.

## Important production gaps

This release is a learning prototype, not a multi-user SaaS platform. CTF answers and front-end logic are visible to visitors; localStorage can be edited; there is no backend authentication, database, anti-cheat mechanism or certificate verification. Do not use it to store sensitive data or run untrusted code.

## Future production work

- Move identity, progress and case records to a secure backend with role-based access.
- Add instructor-managed cohorts, marking rubrics and audit logs.
- Add isolated per-user lab containers only after a security review, with strict resource limits, reset controls, network egress restrictions and abuse monitoring.
- Add accessible keyboard-first event timelines, more report templates and validated export formats.
- Add automated tests for scenario unlocks, scoring, saved progress and responsive layouts.
