# Academy platform delivery and verification

## Delivered
- Fictional pentest workstation: five structured cases (access control, cloud storage, authentication telemetry, web rendering, network segmentation).
- In-browser allowlisted simulated terminal commands: help, scope, ls, cat, inspect, simulate, lesson, status, clear. Commands never execute OS processes or send network requests.
- Fictional evidence file browser, tutorials, hints, knowledge checks, locally saved findings, report export and completion-oriented grading.
- Existing 100-topic Red Team scenario simulator retained and linked to the new workstation.
- Supabase student accounts and RLS-backed student progress, role table, read-only administrator dashboard.
- Progress sync guard on shared browsers: warns before importing unowned device progress and blocks syncing another user's claimed local progress.

## Verification checklist (manual browser testing required)
1. Open academy/pentest-workstation.html on desktop and mobile; check that no layout overflows.
2. For every case, run help, ls, cat scope.txt, cat the required evidence files, simulate, and status.
3. Confirm unsupported terminal commands cannot execute code or access real hosts.
4. Complete the original knowledge check and save/export a fictional finding.
5. Verify grading is explicitly completion-based; it does not judge report accuracy.
6. Test sign-up, sign-in, sign-out and password reset in Supabase Auth with a test account.
7. Verify an ordinary student cannot view another user's progress or access admin.html.
8. Verify an authorized admin can view read-only progress, but cannot change another student's progress.
9. Test two separate student accounts on a shared browser to confirm sync refuses cross-account data.
10. Test in mobile browsers and with third-party script blocking.

## Not delivered / infrastructure-dependent
- No actual virtual machines, containers, real shells, network scanners, attack tools or live target systems. GitHub Pages cannot securely host these.
- No server-side assessment grading; reports are assessed for completeness and length only.
- No automatic background cloud sync of all workstation exercises.
- Instructor authoring and role-management UI are not implemented.
- Authentication provider settings, verified SMTP, CAPTCHA, and assignment of Owner role must be configured and verified separately.
- No automated end-to-end browser suite has been executed.

## Security and rollout
Keep all labs synthetic and in-browser until isolated, monitored server infrastructure is available. Avoid putting secrets or privileged Supabase keys into GitHub Pages. Keep Supabase RLS enabled and test access boundaries with separate student accounts. Email confirmation was disabled temporarily by the project owner; restore verified-email enrollment before public rollout. Enable compromised-password protection and bot protection where supported.
