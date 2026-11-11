# OJ // NEXUS SEC Academy — Advanced Platform Setup

## What is deployed now
The GitHub Pages academy includes a simulated Cyber Range Studio with ten guided labs, a synthetic SIEM/detection tester, topology viewer, timeline investigation, intelligence board, nine role-based investigations, a browser-sandboxed mock portal, assessments, local portfolio and a capstone case.

These are **educational simulations**. The sandboxed iframe does not provide a real VM, container, executable shell, or network access. The scenarios do not target real systems.

## Optional secure student accounts (requires your Supabase project)
GitHub Pages serves static files and **cannot host a backend or a database**. The repository contains an opt-in managed backend integration. To enable it:

1. Create a Supabase project owned by the academy administrator.
2. Open Supabase SQL Editor and run `supabase/schema.sql`. It enables Row Level Security and limits each signed-in student to their own progress row.
3. In Supabase Auth, configure the approved site URL and redirect URLs for the GitHub Pages academy. Review email confirmation, abuse prevention, rate limits and the provider's terms, especially for student accounts.
4. Edit `public/academy/assets/backend-config.js` to supply the project's public URL and **publishable/anon key only**. Never commit service-role keys, database passwords, JWT signing secrets, or personal credentials.
5. Deploy and test with two separate test accounts: account A must never be able to read or update account B's row. Test sign-up, confirmation, sign-in, sign-out and manual progress sync.
6. Publish a privacy notice and data-retention policy before enrolling real students. Provide account/data deletion processes, guardian/age-appropriate consent where required, and follow applicable laws.

The account UI shows an explicit setup message until configuration is supplied. Existing local-only learning works without Supabase. Sync is manual and stores completed labs, assessment scores and case notes; it is not a full learning-management system.

## What is NOT deployed
No production backend has been provisioned. No real isolated virtual machines, containers or executable attack ranges have been deployed. Building these requires separate hosting, strong tenant isolation, resource quotas, egress controls, security monitoring, abuse handling, administrator credentials and ongoing operational costs. Do not expose untrusted shell execution from GitHub Pages.

## Production validation checklist
- Test on Chrome, Firefox and mobile; verify all studio tabs render.
- Check console for script errors and broken network requests.
- Confirm training iframe is sandboxed and no real external targets are contacted.
- Test Supabase Row Level Security using two accounts.
- Verify privacy, retention, deletion and student consent workflows.
- Add server-side limits and monitoring before scaling student sign-ups.
- Perform a professional security review before enabling public accounts.

## References
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
