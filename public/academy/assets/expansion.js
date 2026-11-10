/* NEXUS//SEC expansion pack: defensive attack library, CTFs and role-based live range.
   All telemetry and incidents are synthetic and remain inside this browser application. */

NAV.push(["attacks", "Attack Library"], ["range", "Live Range"]);
PAGES.attacks = "attacks.html";
PAGES.range = "range.html";

const safeText = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));

const ATTACKS = [];
function addAttackGroup(category, items) {
  items.forEach((item, index) => ATTACKS.push({
    id: `a${String(ATTACKS.length + 1).padStart(3, "0")}`,
    category,
    name: item[0],
    overview: item[1],
    signals: item[2],
    response: item[3],
    prevention: item[4] || item[3]
  }));
}

addAttackGroup("Identity & access", [
  ["Brute-force login", "Repeated password guesses are made against one account or service until a credential is found or the account is locked.", "Clusters of failed sign-ins, repeated source patterns, account lockouts, followed by an unusual success.", "Correlate failures and successes, validate the account owner, preserve logs, then contain confirmed account misuse.", "Use MFA or passkeys, rate limits, smart lockout, unique passwords and alerts for login velocity."],
  ["Password spraying", "A small set of common passwords is tried across many accounts to avoid concentrating failures on one user.", "Many accounts receive one or a few failures in a short window, often from shared infrastructure.", "Group authentication events by time, source and account; identify affected users and check for any successful sign-ins.", "MFA, breached-password screening, conditional access and cross-account detection rules."],
  ["Credential stuffing", "Previously exposed username/password pairs are replayed against another service, relying on password reuse.", "Login failures or successes across many accounts, unusual device fingerprints and high login volume.", "Check identity-provider risk signals, session history and affected accounts; revoke suspicious sessions.", "Unique passwords, MFA/passkeys, breached-credential detection and bot-aware rate limiting."],
  ["MFA fatigue", "A user receives repeated authentication prompts in the hope they approve one accidentally or under pressure.", "Unusual prompt bursts, repeated denials, user reports and a success inconsistent with the user's normal context.", "Contact the user through a trusted channel, revoke sessions if compromise is confirmed and investigate the sign-in sequence.", "Number matching, phishing-resistant MFA, prompt rate limits and user awareness."],
  ["Pass-the-hash", "An attacker misuses a password hash or equivalent credential material instead of knowing the plaintext password.", "Unexpected use of legacy authentication, privileged logons from unusual hosts and lateral access patterns.", "Review endpoint and authentication telemetry, scope privileged accounts and rotate credentials using an approved response plan.", "Credential Guard, least privilege, modern authentication and reduction of reusable credential exposure."],
  ["Kerberoasting", "Service-account authentication tickets are targeted for offline password analysis when service-account secrets are weak.", "Unusual bursts of service-ticket requests, atypical requester accounts and weak service-account hygiene.", "Review ticket-request patterns and service-account ownership; prioritise exposed high-privilege identities.", "Long random managed service-account secrets, gMSAs, least privilege and monitoring of unusual ticket activity."],
  ["Session hijacking", "A valid authenticated session is taken over, allowing actions as the legitimate user.", "A session appears from a new device or location, overlapping sessions, or sensitive actions outside normal behaviour.", "Revoke affected sessions, re-authenticate the user and inspect the actions performed during the session.", "Secure cookies, TLS, short-lived sessions, device binding where appropriate and re-authentication for sensitive actions."],
  ["Session fixation", "An application accepts a session identifier that an attacker already knows and keeps it after authentication.", "Session identifiers do not rotate at login or privilege changes; unexpected session reuse is visible.", "Invalidate affected sessions and review authentication/session handling in application code.", "Regenerate session identifiers after login and privilege changes; use secure cookie settings."],
  ["Access-token theft", "A bearer token or refresh token is obtained and reused to act as its owner.", "Token use from unfamiliar devices, impossible travel, unusual API calls or refresh activity.", "Revoke tokens and refresh sessions, identify affected applications and determine which permissions were exercised.", "Short token lifetimes, protected token storage, strong device security and least-privilege scopes."],
  ["Account takeover", "An unauthorised party gains control of a legitimate account through stolen credentials, recovery abuse or social engineering.", "Profile or recovery changes, new MFA devices, unfamiliar sessions and actions inconsistent with the user's history.", "Verify the user, secure the account, revoke sessions, review changes and assess any data or financial impact.", "Phishing-resistant MFA, verified recovery workflows, alerts for account changes and user education."]
]);

addAttackGroup("Social engineering", [
  ["Phishing", "A deceptive message impersonates a trusted sender to make a person reveal information or take an unsafe action.", "Look-alike domains, unexpected links or attachments, urgency, mismatched reply-to details and unusual requests.", "Preserve the message and headers, verify the sender independently, check click activity and follow the mail-containment process.", "Email authentication, filtering, safe link handling, MFA and regular awareness exercises."],
  ["Spear phishing", "A tailored phishing message uses details about a specific person, team or project to appear credible.", "Contextually accurate language paired with an unusual request, attachment or sign-in prompt.", "Validate the request with the supposed sender through a known channel and inspect related mail activity.", "Verification procedures for sensitive actions, strong email controls and targeted awareness training."],
  ["Whaling", "A phishing attempt is aimed at senior leaders or other high-impact decision makers.", "Urgent executive requests, unusual approval paths, confidential payment or data requests.", "Pause the requested action, verify via a trusted contact path and preserve the original message.", "Dual approval, out-of-band verification and protected executive accounts."],
  ["Smishing", "A phishing lure is delivered through SMS or a messaging service.", "Unexpected delivery notices, account warnings, shortened links and requests for one-time codes.", "Do not use the supplied link; verify through the official app or known support channel and report the message.", "Mobile threat protection, user education and phishing-resistant authentication."],
  ["Vishing", "A caller impersonates a trusted person or organisation to obtain access, data or an approval.", "Pressure, requests for codes or remote access, refusal to allow call-back verification.", "End the call and independently call a verified number; notify the relevant security team.", "Call-back procedures, help-desk identity checks and clear rules for handling MFA codes."],
  ["Business email compromise", "An email account or conversation is manipulated to redirect payments, change supplier details or obtain sensitive data.", "Changed bank details, unusual forwarding rules, look-alike domains and last-minute payment pressure.", "Pause the transaction, verify changes with a known supplier contact and involve finance and incident response.", "Dual authorisation, supplier-change verification, MFA and mailbox-rule monitoring."],
  ["Pretexting", "A fabricated scenario is used to persuade someone to disclose information or bypass a process.", "Requests that avoid normal procedures, unverifiable identity claims or pressure to keep the interaction secret.", "Stop and validate identity and authority through the organisation's normal process.", "Consistent verification workflows and staff training to challenge unusual requests."],
  ["Baiting", "A tempting offer or item is used to encourage unsafe behaviour or disclosure.", "Unexpected gifts, downloads or storage devices paired with a request to open or connect something.", "Do not interact with the item; report it and let security handle it using approved procedures.", "Removable-media controls, endpoint protection and awareness training."],
  ["QR-code phishing", "A QR code redirects a person to an untrusted site or credential-collection page.", "Unexpected QR codes in messages, altered posters and a destination domain that does not match the claimed service.", "Inspect the destination domain before proceeding and report the message or poster.", "Mobile URL protection, trusted QR workflows and user education."],
  ["Tailgating", "An unauthorised person follows an authorised person into a controlled physical area.", "Unbadged visitors, doors held open for unknown people and missing visitor records.", "Follow visitor policy, challenge politely where safe and notify site security.", "Access-control doors, visitor escort processes and staff awareness."]
]);

addAttackGroup("Malware & endpoint threats", [
  ["Ransomware", "Malicious software blocks access to systems or data, often alongside attempts to steal information.", "Mass file changes, unusual encryption activity, ransom notes, endpoint alerts and unexpected remote access.", "Isolate affected devices, protect backups, preserve evidence and activate the incident-response plan.", "Offline or immutable backups, patching, endpoint detection, least privilege and tested recovery plans."],
  ["Trojan", "A program appears legitimate but performs unauthorised actions when installed or run.", "Unexpected processes, new persistence records, unusual network connections or file changes.", "Isolate the affected endpoint and collect approved telemetry before removing the artefact.", "Application allow-listing, trusted software sources, endpoint protection and patching."],
  ["Worm", "Malware spreads between systems without requiring each victim to manually open the same file.", "Rapid similar detections across hosts, unusual service-to-service traffic and repeated infection indicators.", "Segment affected areas, identify the common entry path and coordinate containment across endpoints.", "Timely patching, network segmentation, endpoint protection and secure default configurations."],
  ["Spyware", "Software collects information about a user or device without proper authorisation.", "Unexpected data collection, suspicious browser extensions, unusual outbound traffic and privacy alerts.", "Preserve the affected device state and review what information may have been accessed.", "Approved software controls, endpoint monitoring, browser extension governance and updates."],
  ["Keylogger", "Software or hardware records keystrokes without the user's informed consent.", "Unapproved endpoint components, suspicious input-monitoring permissions and account misuse after device exposure.", "Treat credentials used on the device as potentially exposed and investigate the endpoint.", "Endpoint protection, application permissions, device control and phishing-resistant MFA."],
  ["Rootkit", "A stealth-focused component attempts to hide activity or maintain privileged access on a system.", "Integrity-monitoring alerts, unexpected kernel or driver changes and differences between trusted and local views.", "Use trusted forensic procedures; rebuild from known-good media when integrity cannot be trusted.", "Secure boot, signed drivers, patching, least privilege and endpoint integrity monitoring."],
  ["Fileless malware", "Malicious activity relies heavily on legitimate system tools or memory rather than a conventional file on disk.", "Unusual scripting activity, suspicious parent-child process relationships and anomalous memory or network behaviour.", "Correlate process, identity and network telemetry; isolate the host if malicious activity is confirmed.", "Script controls, application control, EDR, logging and least privilege."],
  ["Malicious document macro", "A document feature is abused to trigger unsafe code or retrieve unwanted content.", "Unexpected document-originated child processes, security warnings and attachment patterns.", "Quarantine the document, preserve the email and review endpoint activity around its opening.", "Block untrusted macros, use protected document views and train staff to report unexpected attachments."],
  ["Botnet infection", "Compromised devices are remotely coordinated as a group for activities such as spam or disruption.", "Repeated connections to shared command infrastructure, traffic spikes and similar endpoint alerts.", "Identify affected devices, contain them and coordinate remediation with network and service owners.", "Patch management, secure device configuration, egress monitoring and credential hygiene."],
  ["Wiper malware", "Malicious software destroys or corrupts data to disrupt operations rather than primarily seek payment.", "Unexpected mass deletion or overwrite behaviour, storage-integrity alerts and sudden service failure.", "Prioritise containment and evidence preservation; activate business continuity and recovery procedures.", "Immutable backups, restricted write permissions, segmentation and tested recovery plans."]
]);

addAttackGroup("Network & availability", [
  ["Denial of service", "A service is overwhelmed or made unavailable by excessive or malformed requests.", "Resource saturation, rising errors, slow response and abnormal traffic volume.", "Confirm the affected service and upstream dependencies; engage network and service owners.", "Capacity planning, rate controls, resilient architecture and provider-level protection."],
  ["Distributed denial of service", "Traffic from many sources overwhelms a target or its dependencies.", "Distributed traffic bursts, elevated network utilisation and service health degradation.", "Coordinate with the hosting or network provider, preserve traffic metrics and prioritise service restoration.", "DDoS protection, caching, traffic scrubbing, rate limiting and resilience testing."],
  ["Man-in-the-middle", "A party positions itself between communicating systems and may observe or alter traffic.", "Certificate warnings, unexpected network paths, proxy changes and inconsistent connection behaviour.", "Stop sensitive activity on the affected connection and validate certificates and network configuration.", "TLS with certificate validation, secure Wi-Fi, VPN where appropriate and network monitoring."],
  ["DNS spoofing", "False DNS information directs users or systems to an unintended destination.", "Unexpected resolver answers, mismatched certificates and DNS records that differ from trusted sources.", "Compare responses with trusted resolvers and inspect DNS changes and endpoint activity.", "DNSSEC where appropriate, protected resolvers, change control and DNS monitoring."],
  ["DNS tunnelling", "DNS queries or responses are misused to move data or communicate through a channel not normally used for that purpose.", "Long or high-entropy subdomains, unusual query volume and repeated lookups to rare domains.", "Review resolver telemetry, identify the originating device and correlate with endpoint activity.", "Egress policy, DNS filtering, resolver analytics and endpoint monitoring."],
  ["ARP spoofing", "False local-network address mappings may redirect traffic within a network segment.", "Unexpected address-to-device changes, duplicate address warnings and unusual local traffic paths.", "Validate the network segment and switch telemetry; isolate affected ports according to policy.", "Switch protections, segmentation, static controls for critical systems and monitoring."],
  ["Rogue wireless access point", "An unauthorised Wi-Fi access point imitates or extends a trusted network.", "Unknown SSIDs, unauthorised wireless hardware and clients associated with unapproved access points.", "Locate and assess the device through approved site procedures and review affected client sessions.", "Wireless intrusion detection, access-point inventory and strong enterprise authentication."],
  ["Replay attack", "A previously captured valid message or authentication exchange is reused outside its intended context.", "Repeated identical requests, duplicate transaction identifiers and unexpected reuse of authentication material.", "Check timestamps, nonces and transaction history; revoke affected credentials or sessions if necessary.", "Freshness checks, nonces, timestamps, sequence numbers and replay-resistant protocols."],
  ["IP spoofing", "Network traffic uses a misleading source address, making origin attribution harder.", "Inconsistent routing, source addresses that should not appear on an interface and asymmetric traffic patterns.", "Avoid relying on source IP alone; correlate network, endpoint and identity evidence.", "Ingress and egress filtering, anti-spoofing controls and multi-source attribution."],
  ["DHCP starvation", "A DHCP service is exhausted by excessive address-allocation requests, affecting legitimate clients.", "Rapid lease consumption, unusual request volume and clients unable to obtain network configuration.", "Check DHCP server logs and switch-port telemetry; stabilise affected network segments.", "DHCP snooping, port security, rate limits and address-pool monitoring."]
]);

addAttackGroup("Web & API attacks", [
  ["SQL injection", "Untrusted input is interpreted as part of a database query instead of ordinary data.", "Database errors, unusual query patterns, unexpected result sizes and suspicious request parameters.", "Review application and database logs, determine affected records and validate the code path safely in a test environment.", "Parameterized queries, safe ORM use, least-privilege database accounts and input handling."],
  ["Cross-site scripting", "Untrusted content is rendered as active browser content in another user's session.", "Unexpected script-related content in inputs or logs, browser alerts and reports of altered page behaviour.", "Identify the affected page and stored or reflected content; remove unsafe output paths and assess user impact.", "Context-aware output encoding, safe templates, content security policy and input validation."],
  ["Cross-site request forgery", "A browser is induced to send an authenticated request that the user did not intend.", "State-changing requests without expected anti-CSRF protections and reports of unexpected account changes.", "Review affected actions and session records; reverse unauthorised changes where possible.", "Anti-CSRF tokens, SameSite cookies, origin checks and re-authentication for sensitive actions."],
  ["Server-side request forgery", "An application is tricked into making requests to destinations the application should not access.", "Unexpected outbound requests from application servers, unusual metadata-service access and destination anomalies.", "Review server-side request logs and restrict the affected service's outbound access.", "Destination allow-lists, network segmentation, URL parsing safeguards and egress controls."],
  ["Path traversal", "A file-handling feature accesses files outside its intended directory boundary.", "Unexpected file paths in requests, denied file reads and access to sensitive paths.", "Review file-access logs and affected application code; confirm whether data was exposed.", "Canonical path validation, strict allow-lists and least-privilege file permissions."],
  ["OS command injection", "An application passes untrusted input into an operating-system command context.", "Unexpected child processes, unusual application-server process trees and suspicious request patterns.", "Preserve process and web logs, identify affected application endpoints and review data access.", "Avoid shell invocation, use safe APIs and fixed argument structures, and isolate service accounts."],
  ["Insecure direct object reference (IDOR/BOLA)", "An application fails to verify that a user is allowed to access a specific record or object.", "Users accessing records outside their normal ownership scope and inconsistent authorisation logs.", "Identify exposed records, restrict affected endpoints and review access-control logic.", "Server-side object-level authorisation checks on every request and automated access-control tests."],
  ["Broken authentication", "Authentication or session-management weaknesses allow identity checks to be bypassed or misused.", "Unexpected session reuse, weak recovery flows, anomalous sign-ins and inconsistent authentication logs.", "Review the authentication flow and affected sessions; secure accounts and invalidate risky tokens.", "MFA, secure session lifecycle, rate limits, strong recovery controls and secure defaults."],
  ["Insecure deserialization", "An application trusts serialized data that can cause unintended behaviour when reconstructed.", "Unexpected object types, deserialization exceptions and unusual application process activity.", "Review the affected data flow and application logs; assess whether code paths were reached.", "Avoid unsafe deserialization, authenticate data and use constrained formats and types."],
  ["XML external entity (XXE)", "An XML parser processes external entity references in a way that can expose local or remote resources.", "Unexpected parser requests, outbound lookups from XML-processing services and parser errors.", "Review parser configuration and outbound traffic; assess whether sensitive data was accessible.", "Disable external entity resolution and use hardened parser configurations."]
]);

addAttackGroup("Software & protocol weaknesses", [
  ["Buffer overflow", "A program writes more data into a memory buffer than it can safely hold, potentially corrupting adjacent memory.", "Crashes, memory-integrity alerts and failures associated with unusual input lengths.", "Preserve crash evidence, identify the affected build and assess exposure before deployment continues.", "Memory-safe languages, bounds checking, compiler protections, fuzz testing and timely patching."],
  ["Use-after-free", "A program continues to use a memory object after it has been released.", "Intermittent crashes, memory-safety reports and anomalous behaviour around object lifecycles.", "Capture diagnostic evidence and route the issue to the software owner for secure remediation.", "Memory-safe design, ownership discipline, sanitizers and comprehensive tests."],
  ["Integer overflow", "A numeric operation exceeds the range of its data type and produces an unintended value.", "Unexpected negative or wrapped values, validation inconsistencies and boundary-related failures.", "Identify affected calculations and verify data integrity for impacted transactions.", "Checked arithmetic, range validation, safer types and boundary tests."],
  ["Race condition", "A result depends on the timing or order of concurrent operations, creating an unsafe state.", "Intermittent duplicate actions, inconsistent records or timing-related control failures.", "Preserve application traces and identify the shared resource or state transition involved.", "Atomic operations, locking, transactional design and concurrency testing."],
  ["Format-string vulnerability", "Untrusted input is treated as a formatting specification by a program.", "Unexpected crashes or logging anomalies tied to user-controlled formatting input.", "Review the affected code and diagnostic output; patch the unsafe formatting call.", "Use fixed format strings, safe logging APIs and static analysis."],
  ["Prototype pollution", "Untrusted input alters shared object prototypes in JavaScript environments, potentially changing application behaviour.", "Unexpected object properties, altered application logic and unusual request structures.", "Trace the input path and inspect dependencies; assess affected server-side or client-side components.", "Safe object merging, schema validation, dependency updates and prototype-safe structures."],
  ["HTTP request smuggling", "Front-end and back-end HTTP components interpret message boundaries differently.", "Desynchronised requests, inconsistent proxy/backend logs and unexpected responses.", "Preserve both proxy and application logs; route to the platform team for configuration review.", "Consistent HTTP parsing, proxy normalisation, patched components and regression tests."],
  ["Clickjacking", "A user is visually misled into clicking an interface element they did not intend to activate.", "Reports of unexpected actions from embedded or framed content and missing frame protections.", "Review the affected pages and determine which actions were triggered.", "Frame-ancestors CSP, X-Frame-Options where suitable and clear confirmation for sensitive actions."],
  ["HTTP parameter pollution", "Multiple or conflicting parameter values cause components to interpret a request differently.", "Duplicate parameter names, inconsistent validation and mismatched proxy/application logs.", "Compare request handling across layers and validate the intended parameter schema.", "Reject ambiguous parameters and use consistent parsing and validation across components."],
  ["Open redirect", "A trusted site redirects users to an untrusted destination based on insufficiently validated input.", "Redirect parameters pointing to unfamiliar domains and links used in convincing messages.", "Identify affected links and redirect destinations; remove unsafe redirect behaviour.", "Use fixed destination identifiers or allow-listed destinations and validate redirects server-side."]
]);

addAttackGroup("Cloud & container threats", [
  ["Public cloud storage exposure", "A storage bucket or container unintentionally allows public access to private files.", "Public access configuration, anonymous object reads and unusual download patterns.", "Restrict access, preserve audit logs and determine which objects were accessed.", "Block public access by default, use least-privilege policies and continuously audit storage permissions."],
  ["Over-permissive cloud IAM", "A cloud identity has more permissions than its task requires.", "Broad administrator roles, unused privileges and access from unusual services or locations.", "Review permission usage and reduce excessive privileges through change control.", "Role-based access, permission boundaries, just-in-time elevation and regular access reviews."],
  ["Leaked cloud access key", "A cloud credential is exposed in a repository, ticket, log or other unintended location.", "Secret-scanner alerts, unfamiliar API calls and key use from unexpected contexts.", "Revoke or rotate the key, inspect audit events and identify the exposure source.", "Managed identities, secrets managers, short-lived credentials and repository scanning."],
  ["Public cloud snapshot exposure", "A disk or database snapshot is shared more broadly than intended.", "Snapshot permissions changed unexpectedly or external accounts can see snapshot metadata.", "Restrict sharing, review access history and assess the data contained in the snapshot.", "Default-private snapshots, sharing approvals, encryption and configuration monitoring."],
  ["Exposed cloud management interface", "An administrative console or management endpoint is reachable from an unnecessarily broad network.", "Publicly reachable admin surfaces, repeated sign-in failures and unfamiliar management sessions.", "Restrict exposure, review sign-in history and verify whether any privileged actions occurred.", "Private access paths, MFA, device-aware policies and administrative network segmentation."],
  ["Cloud metadata service abuse", "A workload's metadata interface is accessed in an unintended way, potentially exposing temporary identity credentials.", "Unexpected metadata requests from applications and cloud API activity inconsistent with the workload.", "Review workload identity use, revoke exposed credentials and inspect the affected instance.", "Metadata protections, workload identity, egress restrictions and least-privilege roles."],
  ["Overly broad cloud security group", "A network rule exposes a service or management port to more sources than required.", "Rules allowing broad internet ranges, unexpected inbound connection records and drift from baseline.", "Narrow the rule with the service owner and inspect relevant access logs.", "Infrastructure-as-code review, approved network baselines and continuous configuration checks."],
  ["Kubernetes RBAC misconfiguration", "A workload or user receives excessive permissions in a cluster.", "Wildcard roles, unexpected cluster-admin bindings and service accounts with unused privileges.", "Review role bindings, identify affected workloads and correct access under change control.", "Namespace separation, least-privilege RBAC, workload identity and policy-as-code."],
  ["Container escape risk", "A container configuration or runtime weakness may allow activity beyond its intended isolation boundary.", "Privileged containers, host mounts, unusual host-level activity and runtime alerts.", "Isolate the affected workload and review runtime and host evidence with the platform owner.", "Non-privileged containers, minimal capabilities, patched runtimes and runtime monitoring."],
  ["Serverless permission abuse", "A serverless function's role or event permissions are misused or broader than its purpose.", "Unusual invocation patterns, unexpected data access and broad execution roles.", "Review invocation and audit logs, restrict the function's role and inspect downstream access.", "Per-function roles, event-source validation, secret management and deployment review."]
]);

addAttackGroup("Supply chain & DevSecOps", [
  ["Compromised dependency", "A third-party library is altered or compromised and introduces unwanted behaviour into a product.", "New or unexpected dependency versions, unusual install behaviour and security advisories.", "Pin and verify dependency versions, identify builds containing the component and follow the supplier response.", "Dependency review, lockfiles, software composition analysis and verified package sources."],
  ["Typosquatting package", "A package name is made similar to a popular library to mislead developers into selecting the wrong dependency.", "Near-matching package names, unexpected maintainers and release history anomalies.", "Remove the untrusted package, inspect affected builds and notify repository owners.", "Trusted registries, package allow-lists, lockfiles and dependency review."],
  ["Dependency confusion", "A package manager resolves an unintended package because internal and public package naming or priority is poorly controlled.", "Unexpected registry sources, unfamiliar package versions and build-time dependency changes.", "Trace package resolution and rebuild from trusted sources after confirming the dependency set.", "Scoped package names, registry controls, source pinning and lockfile validation."],
  ["Malicious package update", "A previously trusted package release introduces malicious or unwanted code.", "Unexpected behaviour after an update, suspicious maintainer changes and new network or file activity.", "Identify affected versions, pause rollout and follow the vendor's verified remediation guidance.", "Version pinning, staged rollouts, provenance checks and continuous dependency monitoring."],
  ["CI/CD pipeline compromise", "Build or deployment automation is altered or misused to change software or access protected secrets.", "Unexpected workflow changes, unusual runner activity and deployments outside approved release windows.", "Pause affected pipelines, protect signing credentials and preserve build logs and artifacts.", "Protected branches, isolated runners, short-lived secrets, approval gates and signed artifacts."],
  ["Compromised software update", "A trusted update channel or package is used to distribute an unauthorised change.", "Unexpected publisher or signature details, unusual update behaviour and correlated endpoint activity.", "Validate signatures and vendor advisories, pause deployment where appropriate and scope affected devices.", "Verified signatures, staged deployments, independent integrity checks and supplier risk management."],
  ["Secrets committed to source control", "Passwords, API keys or tokens are stored in a repository where they should not be present.", "Secret-scanner findings, public repository history and suspicious credential use.", "Revoke exposed secrets immediately, inspect access logs and remove the secret from active code and history using approved procedures.", "Secrets managers, pre-commit scanning, short-lived credentials and developer training."],
  ["Compromised CI runner", "A build runner is abused to access build materials, secrets or other pipeline resources.", "Unusual runner processes, unexpected outbound connections and anomalous artifact changes.", "Isolate the runner, rotate exposed pipeline credentials and rebuild affected artifacts from a trusted environment.", "Ephemeral isolated runners, minimal permissions, image integrity and runner monitoring."],
  ["Poisoned container image", "A container image contains an unintended or malicious component before deployment.", "Unexpected image layers, unknown registries, critical package changes and signature mismatches.", "Stop rollout, identify workloads using the image and redeploy a verified image.", "Trusted registries, image signing, scanning, provenance and admission policies."],
  ["Third-party SaaS compromise", "A connected supplier or SaaS account is compromised, affecting data or integrations in the customer environment.", "Unusual OAuth grants, vendor security notices, abnormal API activity and changed integration permissions.", "Review connected applications, revoke suspicious grants and coordinate with the supplier and internal response team.", "Supplier risk reviews, scoped integrations, SSO/MFA and continuous third-party access monitoring."]
]);

addAttackGroup("Data, disruption & AI", [
  ["Data exfiltration", "Information is copied out of an environment without authorisation.", "Large or unusual transfers, new destinations, archive activity and access outside normal working patterns.", "Identify the data, account and destination involved; contain the source and preserve transfer evidence.", "Data-loss prevention, egress controls, least privilege, encryption and access monitoring."],
  ["Data tampering", "Stored or transmitted information is changed without proper authorisation.", "Integrity-check failures, audit-log discrepancies and unexpected changes to high-value records.", "Preserve audit trails, identify changed records and restore verified data through approved procedures.", "Cryptographic integrity checks, immutable audit logs, separation of duties and change control."],
  ["Data poisoning", "Training or operational data is deliberately corrupted to influence a model or analytic system.", "Unexpected data distributions, anomalous labels, drift and model performance changes.", "Quarantine suspect data, compare with trusted sources and assess affected model outputs.", "Data provenance, access control, quality checks, robust validation and monitoring."],
  ["Cryptojacking", "A device or cloud workload is misused to perform unauthorised cryptocurrency mining.", "Sustained high CPU/GPU use, unknown workloads and unusual outbound connections.", "Identify the process and resource owner, isolate the workload where necessary and assess credential exposure.", "Workload inventory, resource monitoring, least privilege and secure image management."],
  ["Resource exhaustion", "An application or infrastructure resource is consumed until legitimate work slows or stops.", "Growing queues, memory or CPU saturation, thread exhaustion and rising error rates.", "Identify the constrained resource, apply safe service-level controls and protect critical workloads.", "Quotas, input limits, autoscaling with safeguards, back-pressure and capacity monitoring."],
  ["Amplification abuse", "A service with an asymmetric request/response pattern is misused to magnify traffic toward another destination.", "Unexpected response volume, unusual request ratios and traffic patterns inconsistent with normal use.", "Coordinate with network providers and review exposed services and traffic metrics.", "Disable unnecessary open services, apply response limits and use source validation where supported."],
  ["BGP route hijacking", "Internet routing announcements cause traffic to take an unintended path.", "Route-origin anomalies, unexpected path changes and reachability shifts across networks.", "Validate route data with trusted network operators and follow routing incident procedures.", "RPKI route-origin validation, routing policy filters and monitoring."],
  ["Route leak", "A network advertises routes beyond its intended scope, potentially diverting or disrupting traffic.", "Unexpected route propagation, path changes and reachability issues.", "Work with network operators to correct announcements and verify route propagation.", "Explicit routing policies, prefix filters, RPKI and regular configuration review."],
  ["TLS downgrade", "A connection is induced to use weaker security settings than the service supports.", "Unexpected protocol versions, cipher changes and downgrade-related handshake failures.", "Inspect TLS telemetry and certificate configuration; restore the approved secure profile.", "Modern TLS versions, secure cipher configuration, HSTS and removal of legacy protocols."],
  ["Certificate misuse", "A certificate is issued, trusted or deployed in a way that enables impersonation or weakens trust.", "Unexpected certificate issuers, hostname mismatches, expiry anomalies and transparency-log alerts.", "Validate certificate chain and ownership, replace the affected certificate and review issuance records.", "Certificate lifecycle management, CA monitoring, automated renewal and strict hostname validation."]
]);

addAttackGroup("Insider, physical & emerging", [
  ["Malicious insider", "A trusted person intentionally misuses their legitimate access to harm the organisation or take information.", "Access outside role needs, unusual bulk retrieval and suspicious changes before departure or conflict.", "Use least privilege and proportionate investigation; preserve evidence and involve HR/legal through policy.", "Separation of duties, access reviews, audit logging and clear reporting channels."],
  ["Negligent insider", "A person unintentionally exposes information or weakens security through an avoidable mistake.", "Misaddressed email, accidental public sharing, lost devices and policy exceptions.", "Contain the exposure, identify affected data and support the user through the incident process.", "Safe defaults, data handling guidance, DLP and usable security controls."],
  ["Privilege misuse", "A user or service uses elevated permissions for actions outside its approved purpose.", "Admin actions at unusual times, privilege grants without tickets and access beyond normal duties.", "Review privileged activity, confirm the business need and revoke unnecessary elevation.", "Just-in-time access, privileged access management, dual control and session recording."],
  ["Shadow IT", "Unapproved apps or services are adopted outside the organisation's security and governance processes.", "Unknown SaaS traffic, unsanctioned file sharing and data stored in unmanaged services.", "Identify the data and business owner, assess exposure and offer an approved alternative.", "Clear procurement paths, sanctioned tools, CASB/SSE controls and user engagement."],
  ["Removable-media compromise", "A removable drive or external storage device introduces unwanted files or exposes copied information.", "Unknown devices, unexpected autorun-like activity and file transfers to unapproved media.", "Disconnect the device under policy, preserve relevant endpoint records and assess data movement.", "Device control, encryption, scanning, allow-lists and secure disposal."],
  ["Shoulder surfing", "Sensitive information is observed by someone who should not see it, often in a shared or public space.", "Exposure of screens, PIN entry or printed information to nearby people.", "Treat exposed credentials as potentially compromised and follow account-security procedures.", "Privacy screens, screen locks, secure workspace habits and restricted viewing areas."],
  ["Dumpster diving", "Discarded documents or devices are examined to obtain sensitive information.", "Sensitive printouts or storage media found in general waste and insecure disposal practices.", "Secure the exposed material and assess whether personal or confidential data was accessible.", "Cross-cut shredding, certified media destruction and documented disposal procedures."],
  ["SIM swapping", "A mobile number is fraudulently transferred to another SIM or provider account, potentially intercepting messages.", "Sudden loss of mobile service, unexpected carrier notifications and account recovery attempts.", "Contact the carrier through a trusted route, secure affected accounts and replace SMS-based recovery where possible.", "Carrier account PINs, number-port protections and phishing-resistant MFA."],
  ["Prompt injection", "Untrusted content attempts to influence an AI system to ignore its intended instructions or disclose information.", "Unexpected instruction-like text in retrieved content, tool requests outside task scope and unusual model behaviour.", "Treat retrieved content as untrusted data, review tool actions and prevent sensitive operations without approval.", "Instruction/data separation, tool allow-lists, human approval gates and output validation."],
  ["AI model extraction", "Repeated access to a model is used to infer or reproduce aspects of its behaviour or intellectual property.", "High-volume structured queries, repeated probing patterns and unusual API usage.", "Review API usage, protect model and training-data assets and assess potential information exposure.", "Rate limits, query monitoring, access controls, output filtering and careful API design."]
]);

if (ATTACKS.length !== 100) console.warn(`Attack library expected 100 entries, found ${ATTACKS.length}`);
let ATTACK_SELECTED = null;

function attackCard(a) {
  return `<article class="card attack-card click" data-search="${safeText((a.name+" "+a.category+" "+a.overview+" "+a.signals).toLowerCase())}" onclick="openAttack('${a.id}')"><div class="attack-card-top"><span class="tag">${safeText(a.category)}</span><span class="attack-index">${a.id.toUpperCase()}</span></div><h3>${safeText(a.name)}</h3><p class="mu">${safeText(a.overview)}</p><span class="attack-open">Open defender tutorial ↗</span></article>`;
}
V.attacks = function () {
  if (ATTACK_SELECTED) {
    const a = ATTACKS.find(x => x.id === ATTACK_SELECTED);
    if (a) return `<a href="#" class="back-link" onclick="ATTACK_SELECTED=null;document.getElementById('main').innerHTML=V.attacks();return false">← Back to all 100 attacks</a>
      <div class="range-kicker">DEFENDER FIELD GUIDE / ${a.id.toUpperCase()}</div><h1>${safeText(a.name)}</h1><span class="tag">${safeText(a.category)}</span>
      <p class="attack-lede">${safeText(a.overview)}</p>
      <div class="grid attack-detail-grid">
        <div class="card"><span class="dash-icon">01 / DETECT</span><h3>What to look for</h3><p>${safeText(a.signals)}</p></div>
        <div class="card"><span class="dash-icon">02 / RESPOND</span><h3>Defender response</h3><p>${safeText(a.response)}</p></div>
        <div class="card"><span class="dash-icon">03 / PREVENT</span><h3>Reduce the risk</h3><p>${safeText(a.prevention)}</p></div>
      </div>
      <div class="box"><b>Analyst habit:</b> do not label an event an attack based on one clue alone. Correlate evidence, asset importance, identity context and expected business activity.</div>
      <button class="b" onclick="mark('attack-${a.id}');this.textContent='✓ Tutorial marked complete';this.disabled=true">${S.done['attack-'+a.id]?'✓ Completed':'Mark tutorial complete'}</button>`;
  }
  const cats = [...new Set(ATTACKS.map(a => a.category))];
  const done = ATTACKS.filter(a => S.done['attack-'+a.id]).length;
  return `<div class="range-kicker">NEXUS//SEC KNOWLEDGE BASE</div><h1>100 common cyber attack patterns</h1>
    <p class="mu">A defender-focused field guide. Learn the concept, recognise telemetry clues, choose a safe response and understand preventive controls. No real targets or exploit instructions are involved.</p>
    <div class="attack-summary"><div><b>${ATTACKS.length}</b><span>Attack patterns</span></div><div><b>${cats.length}</b><span>Categories</span></div><div><b>${done}/100</b><span>Tutorials completed</span></div></div>
    <div class="attack-filters"><input id="attack-search" class="library-search" placeholder="Search attacks, indicators or defences…" oninput="renderAttackGrid()"><select id="attack-category" onchange="renderAttackGrid()"><option value="">All categories</option>${cats.map(c=>`<option>${safeText(c)}</option>`).join('')}</select></div>
    <div id="attack-grid" class="grid attack-grid">${ATTACKS.map(attackCard).join('')}</div>`;
};
function renderAttackGrid() {
  const root = document.getElementById('attack-grid'); if (!root) return;
  const q = (document.getElementById('attack-search')?.value || '').toLowerCase();
  const cat = document.getElementById('attack-category')?.value || '';
  const list = ATTACKS.filter(a => (!cat || a.category === cat) && (!q || (a.name+' '+a.category+' '+a.overview+' '+a.signals+' '+a.response+' '+a.prevention).toLowerCase().includes(q)));
  root.innerHTML = list.length ? list.map(attackCard).join('') : '<div class="card">No matching attack patterns. Try another search.</div>';
}
function openAttack(id) { ATTACK_SELECTED = id; document.getElementById('main').innerHTML = V.attacks(); window.scrollTo(0,0); }

/* Additional self-contained blue-team CTFs. Each flag is based on synthetic evidence. */
CTF.push(
  {id:'c13',cat:'Identity',pts:100,title:'MFA Prompt Storm',d:'Review the identity timeline. Identify the account that approved an unexpected MFA prompt. Submit NEXUS{account_name}.',data:'08:02 user=amoyo result=denied device=known\n08:04 user=amoyo result=denied device=known\n08:05 user=amoyo result=approved device=unknown\n08:07 user=amoyo token_refresh=success source=198.51.100.24',f:'NEXUS{amoyo}',h:'The unusual approval is on the same account as the prompt burst.'},
  {id:'c14',cat:'Email',pts:100,title:'Reply-To Mismatch',d:'The visible sender and reply address differ. Identify the untrusted reply domain. Flag format: NEXUS{domain}.',data:'From display: Finance Director <finance@northstar.example>\nReply-To: payment-update@northstar-mail.test\nReturn-Path: bounces@mailer.test\nSubject: Supplier bank update',f:'NEXUS{northstar-mail.test}',h:'Check the Reply-To field, not the display name.'},
  {id:'c15',cat:'Cloud',pts:100,title:'Bucket Exposure',d:'Which storage container allowed public reads? Flag format NEXUS{bucket_name}.',data:'09:10 config audit: hr-archive publicAccess=blocked\n09:11 config audit: customer-export publicAccess=allowed\n09:12 object read principal=anonymous bucket=customer-export\n09:13 cloud alert severity=high',f:'NEXUS{customer-export}',h:'Match the anonymous object-read event to the public bucket.'},
  {id:'c16',cat:'DFIR',pts:100,title:'Timeline Reconstruction',d:'Put the evidence in order and name the first affected endpoint.',data:'09:14 EDR alert on FIN-LT-07\n09:18 identity log: user session from FIN-LT-07\n09:22 file server access from FIN-LT-07\n09:31 endpoint isolated: FIN-LT-07',f:'NEXUS{FIN-LT-07}',h:'The earliest event identifies the first affected endpoint.'},
  {id:'c17',cat:'Windows',pts:100,title:'Admin Group Change',d:'Which new account was added to the local Administrators group? Flag format NEXUS{username}.',data:'4625 failed logon: analyst2\n4720 user created: temp-support\n4732 member added to Administrators: temp-support\n1102 audit log cleared: actor=temp-support',f:'NEXUS{temp-support}',h:'Read the 4732 group-membership event.'},
  {id:'c18',cat:'Network',pts:100,title:'DNS Beacon Clue',d:'Which endpoint generated the unusual high-volume DNS queries? Flag format NEXUS{hostname}.',data:'resolver summary:\nWS-22 normal: 42 queries / 10 min\nFIN-WS-04: 640 queries / 10 min, long random labels\nHR-WS-11 normal: 37 queries / 10 min',f:'NEXUS{FIN-WS-04}',h:'Compare query volume and label characteristics.'},
  {id:'c19',cat:'SOC',pts:100,title:'Egress Outlier',d:'Identify the host responsible for the unusual outbound data volume. Flag format NEXUS{hostname}.',data:'Outbound transfer summary:\nENG-01: 18 MB\nFIN-SRV-02: 12.8 GB to unfamiliar destination at 02:13\nHR-03: 21 MB\nBACKUP-01: 8.2 GB to approved backup provider',f:'NEXUS{FIN-SRV-02}',h:'Exclude the approved backup transfer and compare the remaining volumes.'},
  {id:'c20',cat:'Linux',pts:100,title:'Permission Audit',d:'A backup script should use mode 750. Which file is currently world-writable? Flag format NEXUS{filename}.',data:'-rwxr-x--- deploy.sh\n-rwxrwxrwx backup.sh\n-rw-r----- secrets.env\n-rw-r--r-- README.txt',f:'NEXUS{backup.sh}',h:'The world-writable file has write permission for others.'},
  {id:'c21',cat:'AppSec',pts:100,title:'Object Authorisation',d:'A case record was returned to a user who does not own it. Identify the missing control. Flag format NEXUS{control}.',data:'API review:\nGET /api/cases/1042\nAuthenticated user: analyst-7\nRecord owner: analyst-2\nResponse: 200 OK\nExpected: server-side object-level authorisation check',f:'NEXUS{object_authorisation}',h:'The API checked identity but not permission on that specific record.'},
  {id:'c22',cat:'Vulnerability Mgmt',pts:100,title:'Prioritise the Finding',d:'A known-exploited flaw is on an internet-facing VPN. Name the priority. Flag format NEXUS{priority}.',data:'Finding: VPN gateway\nCVSS: 9.1\nExposure: internet-facing\nKnown exploitation: yes\nAsset criticality: high',f:'NEXUS{p1}',h:'Active exploitation, public exposure and criticality make this the top priority.'},
  {id:'c23',cat:'Supply Chain',pts:100,title:'Dependency Drift',d:'Identify the unapproved package version in the build record. Flag format NEXUS{version}.',data:'Approved lockfile: secure-utils 2.4.1\nBuild record: secure-utils 2.4.1\nRuntime inventory: secure-utils 9.9.9\nChange ticket: none',f:'NEXUS{9.9.9}',h:'Compare the runtime inventory with the approved lockfile.'},
  {id:'c24',cat:'Cloud',pts:100,title:'Kubernetes RBAC',d:'Which binding grants excessive cluster-wide privileges? Flag format NEXUS{binding_name}.',data:'rolebinding read-metrics -> namespace=metrics, verbs=get/list\nclusterrolebinding support-admin -> clusterrole=cluster-admin, subject=service-account:reports\nrolebinding app-reader -> namespace=app, verbs=get',f:'NEXUS{support-admin}',h:'Look for the binding to cluster-admin.'},
  {id:'c25',cat:'Threat Hunting',pts:100,title:'ATT&CK Behaviour',d:'A process is configured to start again after reboot. Name the behaviour category. Flag format NEXUS{category}.',data:'EDR note: unfamiliar scheduled task\nTrigger: system startup\nAction: launches approved-looking updater\nOwner: unknown',f:'NEXUS{persistence}',h:'The clue is maintaining execution across restarts.'},
  {id:'c26',cat:'Forensics',pts:100,title:'Evidence Integrity',d:'Which evidence item has a matching acquisition and verification hash? Flag format NEXUS{evidence_id}.',data:'E-17 acquisition SHA-256: 8a1f...c921\nE-17 verification SHA-256: 8a1f...c921\nE-18 acquisition SHA-256: 77a0...1b20\nE-18 verification SHA-256: 77a0...1b21',f:'NEXUS{E-17}',h:'A matching hash supports integrity for the evidence copy.'},
  {id:'c27',cat:'API',pts:100,title:'API Audit Trail',d:'Which API request is missing an authenticated identity? Flag format NEXUS{request_id}.',data:'req-771 auth=sub=analyst-5 route=/api/profile status=200\nreq-772 auth=none route=/api/export status=200\nreq-773 auth=sub=analyst-8 route=/api/cases status=403',f:'NEXUS{req-772}',h:'The export request returned success despite having no identity context.'},
  {id:'c28',cat:'SOC',pts:100,title:'Correlate the Events',d:'Which source appears in both the failed sign-ins and later successful sign-in? Flag format NEXUS{ip}.',data:'09:01 failed user=ops source=198.51.100.77\n09:02 failed user=ops source=198.51.100.77\n09:03 failed user=ops source=198.51.100.77\n09:04 success user=ops source=198.51.100.77',f:'NEXUS{198.51.100.77}',h:'Correlate the common source field across the four events.'},
  {id:'c29',cat:'Continuity',pts:100,title:'Recovery Objective',d:'A service owner accepts at most 30 minutes of data loss. Identify the RPO in minutes. Flag format NEXUS{number}.',data:'Business impact statement:\nMaximum acceptable data loss: 30 minutes\nTarget restoration time: 4 hours',f:'NEXUS{30}',h:'RPO is the recovery point objective: acceptable data loss.'},
  {id:'c30',cat:'PKI',pts:100,title:'Certificate Name Check',d:'The service is portal.example.test. Which certificate field must include that hostname? Flag format NEXUS{field}.',data:'Subject CN: legacy.example.test\nSAN: api.example.test, files.example.test\nRequested URL: portal.example.test',f:'NEXUS{subject_alternative_name}',h:'Modern hostname verification uses the SAN extension.'},
  {id:'c31',cat:'Threat Intel',pts:100,title:'Confidence Rating',d:'An IOC comes from one anonymous post and has no corroboration. Choose the cautious confidence label. Flag format NEXUS{label}.',data:'Source: anonymous public post\nCorroborating sources: none\nTechnical validation: pending\nRecommended confidence: low',f:'NEXUS{low}',h:'Do not overstate an unverified indicator.'},
  {id:'c32',cat:'Incident Reporting',pts:100,title:'Executive Summary',d:'A good executive summary explains business impact in plain language. Identify the missing report section. Flag format NEXUS{section}.',data:'Draft report sections:\n- Technical timeline\n- Evidence references\n- Containment actions\n- Detailed log extracts\nMissing: plain-language description of what happened and business effect',f:'NEXUS{executive_summary}',h:'This is the concise plain-language overview for decision makers.'}
);

/* Role-based live cyber range: all activity is synthetic, streamed locally, and read-only. */
const RANGE_ROLES = [
  {id:'soc',name:'SOC Analyst',level:'Tier 1 → Tier 2',mission:'Triage a live identity alert, correlate authentication events, scope impact, contain access and write the handover.',scenario:'SSH credential attack against a fictional finance gateway',events:[
    ['09:14:00','SIEM','ALERT SEV-2: repeated SSH authentication failures on FIN-GW-01; user=svc-backup'],
    ['09:14:05','AUTH','Failed SSH login user=svc-backup source=198.51.100.44 count=14 in 90s'],
    ['09:14:11','AUTH','Successful SSH login user=svc-backup source=198.51.100.44; device=unusual'],
    ['09:14:17','EDR','New interactive shell observed on FIN-GW-01; parent=sshd; account=svc-backup'],
    ['09:14:25','NETWORK','FIN-GW-01 initiated connection to unfamiliar host 203.0.113.88 on approved egress path'],
    ['09:14:32','FILE','Sensitive finance directory read by svc-backup outside normal backup window'],
    ['09:14:40','SIEM','Related sign-in alert: same account used from 198.51.100.44; case correlation updated']
  ],stages:[
    {gate:2,title:'1 · Validate and triage the alert',prompt:'What is the best first analyst action?',options:['Correlate the failure burst with the success event, account role and host context','Close it because SSH is an approved service','Block every external IP immediately without checking scope'],correct:0,why:'Correlate the source, identity, service and sequence. The successful login after repeated failures makes this high priority.'},
    {gate:4,title:'2 · Establish scope and confidence',prompt:'Which conclusion is best supported by the evidence so far?',options:['A confirmed service-account login occurred from an unusual source and an interactive shell followed','The gateway is definitely safe because the service is called backup','The entire organisation is compromised'],correct:0,why:'The events support suspicious access on one named gateway. Keep the scope evidence-based.'},
    {gate:6,title:'3 · Recommend containment',prompt:'Choose the safest proportionate containment recommendation.',options:['Disable or suspend the affected account, revoke active sessions/keys, isolate the host under the incident plan and preserve evidence','Delete the logs and reboot the gateway','Turn off all company internet access'],correct:0,why:'Contain the identity and host involved, coordinate with the owner, and preserve evidence for investigation.'},
    {gate:7,title:'4 · Escalate and hand over',prompt:'What should the case handover include?',options:['Severity, affected identity/host, timeline, source indicators, evidence, actions taken and unknowns','Only the suspicious IP address','A statement that the attacker identity is known'],correct:0,why:'A useful handover separates confirmed facts, hypotheses, impact and next actions.'}
  ],report:['svc-backup','FIN-GW-01','198.51.100.44','contain']},
  {id:'ir',name:'Incident Responder',level:'Contain → Recover',mission:'Lead a simulated endpoint incident from evidence preservation through containment, eradication, recovery and lessons learned.',scenario:'Endpoint compromise with possible movement to a file server',events:[
    ['10:02:00','EDR','High alert on FIN-WS-07: untrusted document spawned an unfamiliar process'],
    ['10:02:08','IDENTITY','User thandi.m authenticated from FIN-WS-07 shortly after alert'],
    ['10:02:16','NETWORK','FIN-WS-07 contacted update-check.example.invalid; destination not in approved inventory'],
    ['10:02:25','EDR','Related alert on FILE-SRV-02: new remote session from FIN-WS-07'],
    ['10:02:34','DATA',"Finance share read volume exceeds the user's normal baseline"],
    ['10:02:43','BACKUP','Last known-good backup for finance share: 01:00; integrity check passed'],
    ['10:02:52','OPS','Business owner confirms finance service can operate in read-only mode during recovery']
  ],stages:[
    {gate:2,title:'1 · Preserve evidence',prompt:'What should happen before destructive cleanup?',options:['Record times, alert IDs and host details; preserve logs and volatile evidence using the approved process','Delete the suspicious file and clear the event log','Reimage every workstation immediately'],correct:0,why:'Preserve evidence and record chain-of-custody details before changes that may destroy context.'},
    {gate:4,title:'2 · Contain the incident',prompt:'What is the proportionate containment plan?',options:['Isolate the affected workstation and restrict the implicated server session while coordinating with system owners','Wait until every file has been reviewed','Disable the whole network permanently'],correct:0,why:'Contain the affected endpoint and access path while maintaining essential business operations.'},
    {gate:6,title:'3 · Eradicate and recover',prompt:'Which recovery approach is strongest?',options:['Remove the root cause, rotate exposed credentials, rebuild from trusted sources and validate against clean backups','Restore the same affected image without checking it','Reconnect all devices immediately'],correct:0,why:'Recovery requires trusted systems, secure credentials, validation and staged reconnection.'},
    {gate:7,title:'4 · Close the incident',prompt:'What is required before closure?',options:['Confirm service health, monitor for recurrence, document impact and assign lessons-learned actions','Close the ticket when the alert disappears','Delete temporary notes'],correct:0,why:'Closure includes service validation, monitoring, communication and improvement actions.'}
  ],report:['FIN-WS-07','FILE-SRV-02','evidence','recovery']},
  {id:'hunter',name:'Threat Hunter',level:'Hypothesis → Detection',mission:'Form a hypothesis, query synthetic telemetry, separate normal from suspicious behaviour and write a reusable detection idea.',scenario:'Possible beaconing and staged data movement',events:[
    ['11:20:00','DNS','FIN-LT-12 generated 180 lookups to a long-random-label subdomain under example.invalid'],
    ['11:20:06','EDR','FIN-LT-12 has an unfamiliar unsigned process with repeated short network connections'],
    ['11:20:12','PROXY','Same host contacted one destination at roughly 60-second intervals for 22 minutes'],
    ['11:20:18','IDENTITY','User account logged in normally from the assigned device; no MFA failure burst'],
    ['11:20:24','DLP','Outbound archive-sized transfer blocked by policy; no confirmed data loss'],
    ['11:20:30','ASSET','FIN-LT-12 owner confirms no approved automation job is scheduled'],
    ['11:20:36','SIEM','Similar periodic pattern found on one additional workstation; both share software inventory']
  ],stages:[
    {gate:2,title:'1 · State the hypothesis',prompt:'Which hypothesis best fits the first two signals?',options:['A host may be using a repeated outbound channel that warrants validation','All DNS activity is malicious','The event proves a data breach'],correct:0,why:'A hypothesis guides the hunt but is not a verdict. Test it against multiple telemetry sources.'},
    {gate:4,title:'2 · Query and correlate',prompt:'Which next comparison adds the most value?',options:['Compare connection intervals, destination rarity and process lineage across endpoints','Count the number of employee email messages','Ignore endpoint context and block every domain'],correct:0,why:'Timing, rarity and process context help distinguish a beacon-like pattern from normal traffic.'},
    {gate:6,title:'3 · Assess the evidence',prompt:'What is the most defensible conclusion?',options:['Suspicious recurring communications are present; the blocked transfer means exfiltration is not yet confirmed','Data theft is confirmed','The alert is a false positive because the user logged in normally'],correct:0,why:'State what is confirmed and what is not. A blocked attempt is not proof that data left the environment.'},
    {gate:7,title:'4 · Create a detection idea',prompt:'What should a durable detection combine?',options:['Rare destination + periodic timing + unusual process + host context, with a suppression for approved jobs','One fixed IP address only','A rule that alerts on every DNS request'],correct:0,why:'Multi-signal detections are more robust and easier to tune than a single brittle indicator.'}
  ],report:['FIN-LT-12','periodic','blocked','detection']},
  {id:'dfir',name:'Digital Forensics Analyst',level:'Acquire → Analyse',mission:'Protect evidence integrity, build a timeline, correlate artifacts and write defensible forensic findings.',scenario:'Post-incident workstation evidence review',events:[
    ['13:00:00','CASE','Case DF-208 opened; authority and evidence scope recorded by incident lead'],
    ['13:03:00','CUSTODY','Workstation FIN-WS-07 received; seal ID SEAL-440 recorded; receiver=analyst'],
    ['13:07:00','ACQUIRE','Forensic image IMG-01 created using approved write-protected workflow'],
    ['13:08:00','HASH','IMG-01 SHA-256 acquisition hash matches verification hash'],
    ['13:15:00','TIMELINE','Browser download at 09:58 precedes process alert at 10:02'],
    ['13:20:00','TIMELINE','User logon 10:01; remote file-server access 10:02:25'],
    ['13:26:00','CASE','Evidence notes complete; one time-source offset documented for correlation']
  ],stages:[
    {gate:2,title:'1 · Validate authority and custody',prompt:'What makes the evidence handling defensible?',options:['Confirm scope, record seal and transfer details, and document every handler','Start browsing files without recording the source','Rename the device to make it easier to remember'],correct:0,why:'Authority, identification and chain of custody establish where evidence came from and who handled it.'},
    {gate:4,title:'2 · Verify acquisition integrity',prompt:'The acquisition and verification hashes match. What does this support?',options:['The acquired copy has not changed between those hash checks','The device definitely contains malware','The user is responsible'],correct:0,why:'Matching cryptographic hashes support integrity of the acquired copy, not the truth of every interpretation.'},
    {gate:6,title:'3 · Build the timeline',prompt:'What should the timeline do?',options:['Correlate the download, logon, process alert and remote access while documenting clock offsets','Sort events alphabetically by hostname only','Assume the earliest artifact proves intent'],correct:0,why:'A defensible timeline correlates multiple sources and records uncertainty such as time skew.'},
    {gate:7,title:'4 · Write findings',prompt:'Which reporting style is best?',options:['Separate observed artifacts, interpretation, limitations and confidence','Present assumptions as facts','Omit hashes and evidence references'],correct:0,why:'Forensic conclusions must be reproducible and distinguish evidence from interpretation.'}
  ],report:['IMG-01','SHA-256','timeline','limitations']},
  {id:'cloud',name:'Cloud Security Engineer',level:'Identity → Workload',mission:'Investigate cloud audit events, correct an exposure, verify permissions and design a preventive guardrail.',scenario:'Cloud storage exposure and unusual role activity',events:[
    ['14:10:00','CONFIG','Storage bucket customer-exports changed to public-read; change ticket not found'],
    ['14:10:07','AUDIT','Anonymous principal read object invoice-batch-04.csv'],
    ['14:10:14','IAM','Role export-worker used from an unfamiliar workload identity context'],
    ['14:10:21','NETWORK','Storage access originated outside approved service path'],
    ['14:10:28','DATA','Bucket inventory contains customer contact and billing metadata'],
    ['14:10:35','CONFIG','Organisation policy allows public bucket settings in one legacy project'],
    ['14:10:42','AUDIT','Owner confirms public access disabled; access logs retained for review']
  ],stages:[
    {gate:2,title:'1 · Confirm the exposure',prompt:'What is the first cloud-security conclusion?',options:['The bucket allowed public reads and at least one anonymous read is logged','Only a configuration drift occurred; no access is recorded','All cloud accounts are compromised'],correct:0,why:'The config and object-access events together show both exposure and an observed read.'},
    {gate:4,title:'2 · Scope impact',prompt:'What should you establish next?',options:['Identify objects accessed, data classification, time window, role activity and affected project','Delete audit logs to reduce noise','Assume no sensitive information was present'],correct:0,why:'Scope the actual data and identity activity before assigning impact.'},
    {gate:6,title:'3 · Remediate',prompt:'Which remediation is appropriate?',options:['Keep public access disabled, review/revoke suspicious identity credentials and remove the organisation-level permissive exception','Make every bucket public for consistency','Disable all audit logging'],correct:0,why:'Fix both the immediate configuration and the policy weakness that allowed it.'},
    {gate:7,title:'4 · Add a guardrail',prompt:'Which control prevents recurrence?',options:['Policy-as-code denying public access by default plus continuous configuration monitoring','A one-time email reminder only','A dashboard with no alerting'],correct:0,why:'Preventive policy and continuous monitoring make the secure state repeatable.'}
  ],report:['customer-exports','anonymous','policy','monitoring']},
  {id:'appsec',name:'Application Security Engineer',level:'Review → Fix → Verify',mission:'Triage synthetic security findings, validate business impact, propose secure fixes and define regression tests.',scenario:'Release candidate with an access-control defect',events:[
    ['15:40:00','CI','Release candidate RC-42 completed; dependency scan reports one outdated library'],
    ['15:40:08','SAST','Finding: user-controlled value reaches a database query construction path'],
    ['15:40:16','DAST','Test account A received a record owned by test account B'],
    ['15:40:24','CODE REVIEW','Controller checks that a user is logged in but does not verify record ownership'],
    ['15:40:32','ASSET','Affected route handles customer support case metadata'],
    ['15:40:40','CI','Regression suite has no cross-user authorisation test for this route'],
    ['15:40:48','RELEASE','Release manager can hold RC-42 while fixes are reviewed']
  ],stages:[
    {gate:2,title:'1 · Validate findings',prompt:'Which finding has direct evidence of a security boundary failure?',options:['Account A received account B’s record, indicating missing object-level authorisation','The dependency is one minor version old','The build completed successfully'],correct:0,why:'The observed cross-user record access is evidence of an authorisation defect.'},
    {gate:4,title:'2 · Prioritise the fix',prompt:'What should the application team address first?',options:['Add server-side ownership/permission checks on the affected route and review similar routes','Hide the record ID in the browser only','Suppress the scanner finding without review'],correct:0,why:'Authorisation must be enforced on the server for every object access.'},
    {gate:6,title:'3 · Define secure remediation',prompt:'How should database query construction be handled?',options:['Use parameterized queries and least-privilege database access','Concatenate user input into SQL after a client-side check','Rely only on a web application firewall'],correct:0,why:'Parameterized queries keep data separate from query structure; client-side checks are not a security boundary.'},
    {gate:7,title:'4 · Verify before release',prompt:'Which regression tests are needed?',options:['Cross-user access denied, owner access allowed, and input-handling tests in CI','Only a homepage visual test','No tests once the code compiles'],correct:0,why:'Tests should prove both legitimate access and blocked unauthorised access.'}
  ],report:['RC-42','object-level','parameterized','regression']},
  {id:'grc',name:'GRC Analyst',level:'Risk → Controls → Assurance',mission:'Translate an incident into business risk, assess control performance, coordinate governance and document remediation.',scenario:'Customer information may have been accessed by an unauthorised party',events:[
    ['16:05:00','INCIDENT','Security team reports an external party may have accessed customer billing metadata'],
    ['16:05:08','DATA OWNER','Affected dataset contains names, business email addresses and invoice references'],
    ['16:05:16','CONTROL','Access review shows a broad service role was not reviewed in the last two quarters'],
    ['16:05:24','LOGGING','Cloud audit logs are available for the relevant time window'],
    ['16:05:32','LEGAL','Privacy officer and legal contact requested to assess applicable obligations'],
    ['16:05:40','BUSINESS','Service owner confirms no payment card data is stored in this dataset'],
    ['16:05:48','GOVERNANCE','Risk committee requests owner, due date and evidence for corrective actions']
  ],stages:[
    {gate:2,title:'1 · Define the business impact',prompt:'What is the right initial GRC position?',options:['Record the data categories and possible confidentiality impact, while stating that scope is still being confirmed','Declare every customer record was stolen','Close the risk because no payment cards are stored'],correct:0,why:'Describe the known data and uncertainty. Avoid claims that the evidence does not support.'},
    {gate:4,title:'2 · Identify control gaps',prompt:'Which control weakness is evidenced?',options:['A broad service role was not subject to timely access review','The audit logs exist','The dataset has an owner'],correct:0,why:'The overdue access review and broad role are control weaknesses to assess.'},
    {gate:6,title:'3 · Coordinate governance',prompt:'Who should assess notification obligations?',options:['The privacy officer and legal team using confirmed facts and applicable requirements','The analyst alone by guessing a deadline','A public social-media poll'],correct:0,why:'Regulatory and contractual decisions require authorised privacy/legal review based on verified facts.'},
    {gate:7,title:'4 · Track remediation',prompt:'What should the risk register action contain?',options:['Control owner, measurable action, due date, evidence, residual risk and review date','Only the word “resolved”','No accountable owner'],correct:0,why:'Actions need ownership and evidence so governance can verify completion.'}
  ],report:['billing metadata','access review','privacy officer','owner']},
  {id:'pentest',name:'Authorised Security Tester',level:'Scope → Validate → Report',mission:'Work through a fictional, pre-approved assessment: confirm scope, interpret findings, validate safely and deliver a useful report.',scenario:'Scheduled assessment of a training web application',events:[
    ['09:00:00','SCOPE','Signed training scope: app.training.invalid; test window 09:00–10:00; no production data'],
    ['09:03:00','ASSET','In-scope application has login, profile and support-case functions'],
    ['09:08:00','SCAN','Synthetic scanner reports outdated dependency and missing security header'],
    ['09:12:00','REVIEW','Code review indicates support-case endpoint lacks record ownership check'],
    ['09:18:00','VALIDATION','Two test accounts confirm cross-account record access in the isolated training dataset'],
    ['09:25:00','IMPACT','Finding exposes only synthetic case metadata; no real customer data is present'],
    ['09:32:00','CLIENT','Training owner requests remediation advice and retest criteria']
  ],stages:[
    {gate:2,title:'1 · Confirm scope',prompt:'What must happen before assessment activity?',options:['Confirm written scope, time window, allowed methods, test accounts and stop conditions','Assume every reachable system is in scope','Use real customer accounts for realism'],correct:0,why:'Authorisation and scope define what may be assessed and how to stop safely.'},
    {gate:4,title:'2 · Prioritise findings',prompt:'Which finding deserves the most attention?',options:['The verified cross-account record access because it breaks an authorisation boundary','The missing header only because it is easiest','Every scanner result has equal risk'],correct:0,why:'Prioritise demonstrated impact and business context rather than scanner count alone.'},
    {gate:6,title:'3 · Validate safely',prompt:'What is the correct validation standard?',options:['Use only the two supplied test accounts and synthetic records, stop after confirming the issue and preserve minimal evidence','Access unrelated records to find the maximum possible data','Continue beyond the approved time window'],correct:0,why:'Use minimal proof within the agreed scope; do not access unrelated data.'},
    {gate:7,title:'4 · Deliver the report',prompt:'What makes the report useful?',options:['Evidence, affected component, impact, reproduction summary at a safe level, remediation and retest criteria','Only a severity score','A list of tools without findings'],correct:0,why:'A good report is reproducible, proportionate and actionable without exposing unnecessary data.'}
  ],report:['app.training.invalid','two test accounts','record access','retest']},
  {id:'architect',name:'Security Architect',level:'Design → Defend → Assure',mission:'Review a fictional architecture, identify trust-boundary weaknesses and select layered controls with clear trade-offs.',scenario:'Design review after suspicious remote access activity',events:[
    ['12:30:00','ARCH','Remote staff connect to a shared VPN profile with broad network reach'],
    ['12:30:08','IDENTITY','MFA is enabled but legacy service accounts remain password-only'],
    ['12:30:16','NETWORK','User subnet can reach workstation, file server and management interfaces'],
    ['12:30:24','DATA','Finance data store has no separate application-to-database policy boundary'],
    ['12:30:32','LOGGING','Identity, endpoint and network logs are stored in separate consoles'],
    ['12:30:40','RESILIENCE','Critical application has one availability zone and untested recovery objectives'],
    ['12:30:48','GOVERNANCE','Architecture board requests a phased target-state design']
  ],stages:[
    {gate:2,title:'1 · Identify trust boundaries',prompt:'Which design issue is most important to address first?',options:['Broad remote access and password-only service identities create weak trust boundaries','The dashboard colours are inconsistent','Every subnet should be merged'],correct:0,why:'Identity assurance and network reach determine how far one compromised account can reach.'},
    {gate:4,title:'2 · Choose layered controls',prompt:'Which design best reduces lateral movement?',options:['Identity-aware access, separate admin paths, workload segmentation and least-privilege service identities','One flat network with a shared administrator password','Disable all monitoring'],correct:0,why:'Layered identity and segmentation controls limit blast radius.'},
    {gate:6,title:'3 · Improve detection and resilience',prompt:'What should be included in the target architecture?',options:['Centralised correlated logging, tested backups and explicit recovery objectives','A single untested backup copy','More dashboards without alert ownership'],correct:0,why:'Detection, recoverability and accountable operations are architectural capabilities.'},
    {gate:7,title:'4 · Present the design',prompt:'What should the architecture decision record show?',options:['Threats, trust boundaries, chosen controls, trade-offs, owners and phased migration plan','Only a vendor product list','No record of assumptions'],correct:0,why:'An architecture decision record makes the reasoning and operational impact reviewable.'}
  ],report:['trust boundaries','segmentation','centralised logging','recovery']}
];

let RANGE_STATE = null;
let RANGE_TIMER = null;
function rangeRole(id) { return RANGE_ROLES.find(r=>r.id===id); }
function rangeStopTimer() { if (RANGE_TIMER) { clearInterval(RANGE_TIMER); RANGE_TIMER=null; } }
V.range = function () {
  const completed = RANGE_ROLES.filter(r=>S.done['range-'+r.id]).length;
  return `<div class="range-kicker">NEXUS//SEC · SIMULATED CYBER RANGE</div><h1>Live role simulation</h1>
    <p class="mu">Choose a job. A synthetic incident will unfold in real time, telemetry will arrive in the event console and you will perform that role's workflow—from first signal to documented outcome.</p>
    <div class="range-banner"><div><span class="tag">REAL-TIME TRAINING</span><h2>Observe. Investigate. Decide. Report.</h2><p>Incidents stream every few seconds. Your decisions unlock as evidence arrives. Every exercise uses fictional systems, reserved example addresses and synthetic records.</p></div><div class="range-radar"><span>●</span><small>RANGE ONLINE</small></div></div>
    <div class="attack-summary"><div><b>${RANGE_ROLES.length}</b><span>Role simulations</span></div><div><b>${completed}/${RANGE_ROLES.length}</b><span>Completed</span></div><div><b>7</b><span>Telemetry events per scenario</span></div></div>
    <h2>Choose your role</h2><div class="grid range-role-grid">${RANGE_ROLES.map(r=>`<article class="card range-role"><div class="attack-card-top"><span class="tag">${safeText(r.level)}</span>${S.done['range-'+r.id]?'<span class="tag ok">Completed</span>':''}</div><h3>${safeText(r.name)}</h3><p class="mu">${safeText(r.mission)}</p><div class="range-scenario">Scenario: ${safeText(r.scenario)}</div><button class="b" onclick="rangeStart('${r.id}')">${S.done['range-'+r.id]?'Run again':'Start simulation'} →</button></article>`).join('')}</div>
    <div class="box"><b>How the live range works:</b> events are generated locally by the training app, not sent to or received from a real network. The terminal is read-only and accepts investigation queries only.</div>`;
};
function rangeStart(roleId) {
  rangeStopTimer();
  const role = rangeRole(roleId); if (!role) return;
  RANGE_STATE = {roleId, events:[], stageDone:[], score:100, started:Date.now(), paused:false, complete:false, speed:3500, commandHistory:[]};
  const main = document.getElementById('main');
  main.innerHTML = `<a href="#" class="back-link" onclick="rangeStopTimer();RANGE_STATE=null;document.getElementById('main').innerHTML=V.range();return false">← Role simulations</a>
    <div class="range-kicker">LIVE INCIDENT / ${safeText(role.id.toUpperCase())}</div><div class="range-head"><div><span class="tag">${safeText(role.level)}</span><h1>${safeText(role.name)} workbench</h1><p class="mu">${safeText(role.scenario)}</p></div><div class="range-score"><b id="range-score">100</b><span>decision score</span></div></div>
    <div class="range-control card"><div><b>Simulation clock</b><div class="mu" id="range-status">Initialising telemetry stream…</div></div><div class="range-actions"><label class="mu" for="range-speed">Event pace</label><select id="range-speed" onchange="rangeSetSpeed(this.value)"><option value="3500">Normal · 3.5 sec</option><option value="6000">Slow · 6 sec</option><option value="2000">Fast · 2 sec</option></select><button class="o" style="width:auto" id="range-pause" onclick="rangeTogglePause()">Pause</button><button class="o" style="width:auto" onclick="rangeStopTimer();rangeStart('${role.id}')">Restart</button></div></div>
    <div class="range-progress"><div class="bar"><i id="range-progress-bar" style="width:0%"></i></div><span id="range-progress-label">0 / ${role.events.length} events received</span></div>
    <div class="range-workbench">
      <section class="card range-feed"><div class="panel-heading"><div><span class="dash-icon">01 / LIVE TELEMETRY</span><h3>Event stream</h3></div><span class="live-pulse">● LIVE SIM</span></div><div id="range-events" class="range-events"><div class="range-wait">Waiting for the first synthetic event…</div></div>
        <div class="range-console"><div class="terminal-bar"><span class="terminal-dot red"></span><span class="terminal-dot yellow"></span><span class="terminal-dot green"></span><b>${safeText(role.id)}@nexus-range · read-only</b><span class="terminal-live">● SIMULATED</span></div><div id="range-console-output" class="range-console-output">OJ // NEXUS SEC RANGE SHELL\nType help for investigation commands.\n</div><form class="range-command" onsubmit="rangeCommand(event)"><span>${safeText(role.id)}@range:~$</span><input id="range-command-input" autocomplete="off" spellcheck="false" placeholder="help" aria-label="Range investigation command"><button class="b" type="submit">Run</button></form></div>
      </section>
      <section class="range-tasks"><div class="card"><span class="dash-icon">02 / ROLE WORKFLOW</span><h3>Your responsibilities</h3><p class="mu">Tasks unlock as the timeline develops. Select the action you would take and review the coaching feedback.</p><div id="range-task-list"></div></div>
      <div class="card range-notes"><span class="dash-icon">03 / CASE NOTES</span><h3>Working notes</h3><textarea id="range-notes" rows="5" placeholder="Record timestamps, affected assets, user context, indicators and unanswered questions…"></textarea><button class="o" style="width:auto" onclick="rangeSaveNotes()">Save notes to this case</button><span id="range-note-status" class="mu"></span></div></section>
    </div><div id="range-report"></div>`;
  rangeRender();
  rangeTick();
  RANGE_TIMER = setInterval(rangeTick, RANGE_STATE.speed);
  window.scrollTo(0,0);
}
function rangeSetSpeed(value) {
  if (!RANGE_STATE || RANGE_STATE.complete) return;
  RANGE_STATE.speed = Math.max(1500, Math.min(10000, Number(value)||3500));
  if (!RANGE_STATE.paused) { rangeStopTimer(); RANGE_TIMER=setInterval(rangeTick,RANGE_STATE.speed); }
}
function rangeTogglePause() {
  if (!RANGE_STATE || RANGE_STATE.complete) return;
  RANGE_STATE.paused = !RANGE_STATE.paused;
  if (RANGE_STATE.paused) rangeStopTimer(); else RANGE_TIMER=setInterval(rangeTick,RANGE_STATE.speed);
  const b=document.getElementById('range-pause'); if(b)b.textContent=RANGE_STATE.paused?'Resume':'Pause';
  const s=document.getElementById('range-status'); if(s)s.textContent=RANGE_STATE.paused?'Telemetry paused. Resume when ready.':`Telemetry streaming · ${RANGE_STATE.events.length} events received`;
}
function rangeTick() {
  if (!RANGE_STATE || RANGE_STATE.paused || RANGE_STATE.complete) return;
  const role=rangeRole(RANGE_STATE.roleId); if(!role)return;
  const i=RANGE_STATE.events.length;
  if(i>=role.events.length){rangeStopTimer();rangeRender();return;}
  RANGE_STATE.events.push({index:i,stamp:role.events[i][0],source:role.events[i][1],message:role.events[i][2],received:Date.now()});
  rangeRender();
  if(RANGE_STATE.events.length===role.events.length){rangeStopTimer();const s=document.getElementById('range-status');if(s)s.textContent='Timeline complete · all synthetic events received';}
}
function rangeRender() {
  if(!RANGE_STATE)return;
  const role=rangeRole(RANGE_STATE.roleId), received=RANGE_STATE.events.length;
  const feed=document.getElementById('range-events');
  if(feed)feed.innerHTML=RANGE_STATE.events.map(e=>`<div class="range-event"><time>${safeText(e.stamp)}</time><span class="range-event-source">${safeText(e.source)}</span><span>${safeText(e.message)}</span></div>`).join('')+(received<role.events.length?`<div class="range-wait">${RANGE_STATE.paused?'Stream paused…':'Waiting for next event…'}</div>`:'<div class="range-finished">✓ Event stream complete</div>');
  if(feed)feed.scrollTop=feed.scrollHeight;
  const bar=document.getElementById('range-progress-bar');if(bar)bar.style.width=`${received/role.events.length*100}%`;
  const label=document.getElementById('range-progress-label');if(label)label.textContent=`${received} / ${role.events.length} events received`;
  const status=document.getElementById('range-status');if(status && received<role.events.length)status.textContent=`Telemetry streaming · ${received} events received`;
  const score=document.getElementById('range-score');if(score)score.textContent=RANGE_STATE.score;
  const tasks=document.getElementById('range-task-list');if(tasks)tasks.innerHTML=rangeTasksHTML(role);
  rangeMaybeReport();
}
function rangeTasksHTML(role) {
  return role.stages.map((stage,i)=>{
    const done=RANGE_STATE.stageDone[i];
    if(RANGE_STATE.events.length<stage.gate)return `<div class="range-task locked"><span class="tag">LOCKED · ${stage.gate} EVENTS</span><h4>${safeText(stage.title)}</h4><p class="mu">Waiting for more telemetry before this task becomes available.</p></div>`;
    return `<div class="range-task ${done?'completed':''}"><span class="tag">${done?'✓ DECISION RECORDED':'TASK AVAILABLE'}</span><h4>${safeText(stage.title)}</h4><p>${safeText(stage.prompt)}</p>${done?`<div class="box">${safeText(stage.why)}</div>`:stage.options.map((o,j)=>`<button class="o range-choice" onclick="rangeChoose(${i},${j})">${safeText(o)}</button>`).join('')}<div id="range-feedback-${i}" class="mu"></div></div>`;
  }).join('');
}
function rangeChoose(stageIndex, optionIndex) {
  if(!RANGE_STATE)return;
  const role=rangeRole(RANGE_STATE.roleId), stage=role.stages[stageIndex];
  if(!stage || RANGE_STATE.stageDone[stageIndex] || RANGE_STATE.events.length<stage.gate)return;
  if(optionIndex===stage.correct){RANGE_STATE.stageDone[stageIndex]=true;RANGE_STATE.score=Math.min(100,RANGE_STATE.score+0);}
  else RANGE_STATE.score=Math.max(0,RANGE_STATE.score-5);
  const feedback=document.getElementById(`range-feedback-${stageIndex}`);
  if(feedback)feedback.innerHTML=optionIndex===stage.correct?`<span class="range-correct">✓ Decision recorded.</span> ${safeText(stage.why)}`:`<span class="range-incorrect">Not the best choice. −5 points.</span> Review the evidence and try again.`;
  const score=document.getElementById('range-score');if(score)score.textContent=RANGE_STATE.score;
  const tasks=document.getElementById('range-task-list');if(tasks)tasks.innerHTML=rangeTasksHTML(role);
  rangeMaybeReport();
}
function rangeMaybeReport() {
  if(!RANGE_STATE)return;
  const role=rangeRole(RANGE_STATE.roleId);
  const ready=RANGE_STATE.events.length===role.events.length && role.stages.every((s,i)=>RANGE_STATE.stageDone[i]);
  const root=document.getElementById('range-report');if(!root)return;
  if(!ready){root.innerHTML='';return;}
  if(root.dataset.ready==='1')return;
  root.dataset.ready='1';
  root.innerHTML=`<section class="card range-report"><div class="range-kicker">04 / CASE HANDOVER</div><h2>Write your ${safeText(role.name)} report</h2><p class="mu">Complete all four sections. Use your own wording and distinguish confirmed evidence from assumptions.</p>
    <label>Executive summary<textarea id="rr-summary" rows="3" placeholder="What happened, to which asset, and current confidence?"></textarea></label>
    <label>Evidence and timeline<textarea id="rr-evidence" rows="3" placeholder="List key timestamps, identities, hosts and telemetry sources."></textarea></label>
    <label>Impact and scope<textarea id="rr-impact" rows="3" placeholder="What data, systems or business processes may be affected? What is not yet known?"></textarea></label>
    <label>Actions and recommendations<textarea id="rr-actions" rows="3" placeholder="Record containment, remediation, recovery or control recommendations."></textarea></label>
    <button class="b" onclick="rangeSubmitReport()">Submit case handover</button><div id="range-report-feedback"></div></section>`;
}
function rangeSubmitReport() {
  if(!RANGE_STATE)return;
  const ids=['rr-summary','rr-evidence','rr-impact','rr-actions'];
  const values=ids.map(id=>document.getElementById(id)?.value.trim()||'');
  const missing=values.map((v,i)=>v.length<35?['executive summary','evidence and timeline','impact and scope','actions and recommendations'][i]:null).filter(Boolean);
  const out=document.getElementById('range-report-feedback');
  if(missing.length){if(out)out.innerHTML=`<span class="range-incorrect">Please add more detail to: ${missing.map(safeText).join(', ')}. Each section needs at least 35 characters.</span>`;return;}
  const role=rangeRole(RANGE_STATE.roleId);
  RANGE_STATE.complete=true;rangeStopTimer();
  S.rangeReports=S.rangeReports||{};
  S.rangeReports[role.id]={score:RANGE_STATE.score,completedAt:new Date().toISOString(),sections:values};
  mark('range-'+role.id);
  if(out)out.innerHTML=`<div class="box"><b>✓ Case handover accepted.</b><br>Role: ${safeText(role.name)} · Decision score: ${RANGE_STATE.score}/100. Your completion is saved in My Progress.</div><button class="o" style="width:auto" onclick="rangeExportCase()">Export this case file</button><button class="o" style="width:auto" onclick="rangeStopTimer();RANGE_STATE=null;document.getElementById('main').innerHTML=V.range()">Choose another role</button>`;
  const status=document.getElementById('range-status');if(status)status.textContent='Case closed · report saved';
}
function rangeSaveNotes(){if(!RANGE_STATE)return;const role=rangeRole(RANGE_STATE.roleId);S.rangeNotes=S.rangeNotes||{};S.rangeNotes[role.id]=document.getElementById('range-notes')?.value||'';save();const el=document.getElementById('range-note-status');if(el)el.textContent='Saved locally for this browser.';}
function rangeExportCase(){if(!RANGE_STATE)return;const role=rangeRole(RANGE_STATE.roleId);const record={academy:'OJ // NEXUS SEC',simulation:role.name,scenario:role.scenario,events:RANGE_STATE.events,decisions:role.stages.map((s,i)=>({task:s.title,completed:!!RANGE_STATE.stageDone[i],rationale:s.why})),report:S.rangeReports?.[role.id]||null,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(record,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`nexus-${role.id}-case-file.json`;a.click();URL.revokeObjectURL(a.href);}
function rangeCommand(event){event.preventDefault();if(!RANGE_STATE)return;const input=document.getElementById('range-command-input');const output=document.getElementById('range-console-output');const line=(input?.value||'').trim();if(!line)return;input.value='';RANGE_STATE.commandHistory.push(line);const role=rangeRole(RANGE_STATE.roleId),events=RANGE_STATE.events;let result='';const lower=line.toLowerCase();
  if(lower==='help')result='Read-only commands:\n  help                    show this help\n  alerts                  show alert summary\n  evidence                list received evidence\n  cat events.log          print received event log (auth.log alias)\n  grep WORD auth.log      search received events\n  timeline                show received events\n  search WORD             search received telemetry\n  count source-ip         count source addresses in visible events\n  assets                  show observed assets\n  case                    show case status';
  else if(lower==='alerts')result=`Role: ${role.name}\nScenario: ${role.scenario}\nEvents received: ${events.length}/${role.events.length}\nOpen decisions: ${role.stages.filter((s,i)=>!RANGE_STATE.stageDone[i]&&events.length>=s.gate).length}`;
  else if(lower==='evidence'||lower==='timeline'||lower==='cat events.log'||lower==='cat auth.log')result=events.length?events.map(e=>`${e.stamp} [${e.source}] ${e.message}`).join('\n'):'No evidence received yet.';
  else if(lower.startsWith('grep ')){const match=line.match(/^grep\s+(?:-i\s+)?(?:\"([^\"]+)\"|'([^']+)'|(\S+))(?:\s+(?:events|auth)\.log)?$/i);const query=(match&&(match[1]||match[2]||match[3])||'').toLowerCase();const rows=events.filter(e=>(e.stamp+' '+e.source+' '+e.message).toLowerCase().includes(query));result=query?(rows.length?rows.map(e=>`${e.stamp} [${e.source}] ${e.message}`).join('\n'):'(no matches in received evidence)'):'Usage: grep WORD events.log';}
  else if(lower==='count source-ip'){const counts={};events.forEach(e=>{const match=e.message.match(/(?:source|src)=([0-9.]+)/i);if(match)counts[match[1]]=(counts[match[1]]||0)+1;});result=Object.keys(counts).length?Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([ip,n])=>`${String(n).padStart(3)} ${ip}`).join('\n'):'No source IP fields in received events yet.';}
  else if(lower==='assets'){const set=new Set();events.forEach(e=>{(e.message.match(/[A-Z]{2,}(?:-[A-Z0-9]+)+/g)||[]).forEach(x=>set.add(x));});result=set.size?[...set].join('\n'):'No assets observed yet.';}
  else if(lower.startsWith('search ')){const q=line.slice(7).toLowerCase();const matches=events.filter(e=>(e.message+' '+e.source).toLowerCase().includes(q));result=matches.length?matches.map(e=>`${e.stamp} [${e.source}] ${e.message}`).join('\n'):'(no matches in received evidence)';}
  else if(lower==='case')result=`Case: ${role.id.toUpperCase()}\nScore: ${RANGE_STATE.score}\nStream: ${events.length}/${role.events.length}\nTasks: ${RANGE_STATE.stageDone.filter(Boolean).length}/${role.stages.length}\nStatus: ${RANGE_STATE.complete?'closed':'in progress'}`;
  else result='Unknown or unsupported command. Type help. This console is read-only by design.';
  const prompt=`${role.id}@range:~$ ${line}`;output.textContent+=`\n${prompt}\n${result}\n`;output.scrollTop=output.scrollHeight;
}

/* Include the new work in progress tracking without counting every page view. */
pct = function(){
  const keys=[...TUTS.map(x=>x.id),...LABS.map(x=>x.id),...CTF.map(x=>x.id),'quiz',...ATTACKS.map(x=>'attack-'+x.id),...RANGE_ROLES.map(x=>'range-'+x.id)];
  const done=keys.filter(k=>S.done[k]).length;
  return Math.round(done/keys.length*100);
};
const originalDash = V.dash;
V.dash = function(){return originalDash().replace('<div class="box w"><b>Training boundary:</b>', `<div class="grid"><div class="card click" onclick="go('attacks')"><span class="dash-icon">05 / KNOWLEDGE BASE</span><h2>100</h2><b>Attack patterns</b><p class="mu">Defender tutorials, signals and mitigations</p></div><div class="card click" onclick="go('range')"><span class="dash-icon">06 / CAREER SIMULATOR</span><h2>09</h2><b>Live role simulations</b><p class="mu">Real-time fictional incidents for nine jobs</p></div></div><div class="box w"><b>Training boundary:</b>`);};
const originalCtf = V.ctf;
V.ctf = function(){return originalCtf().replace('12 simulated challenges', `${CTF.length} simulated challenges`);};
const originalProgress = V.prog;
V.prog = function(){return `<section class="card" aria-label="Privacy and local progress"><h2>Guest mode & privacy</h2><p>Progress and case notes are saved only in this browser on this device. No account or cloud sync is provided. Avoid entering real names, passwords or sensitive information in case notes.</p><button class="o" onclick="resetLocalProgress()">Reset all local progress</button></section>`+originalProgress()+`<h2>Attack tutorials</h2><p>${ATTACKS.filter(a=>S.done['attack-'+a.id]).length}/100 completed</p><h2>Live role simulations</h2>${RANGE_ROLES.map(r=>`<div>${S.done['range-'+r.id]?'✅':'⬜'} ${safeText(r.name)} ${S.rangeReports?.[r.id]?`· score ${S.rangeReports[r.id].score}/100`:''}</div>`).join('')}`;};


const previousTracksPage = V.tracks;
V.tracks = function(){return previousTracksPage()+`<div class="card" style="margin-top:18px"><h2>Practise the job</h2><p class="mu">Launch a live scenario and perform the workflow for a selected role.</p><button class="b" onclick="go('range')">Open role simulations →</button></div>`;};
const previousCareerPage = V.career;
V.career = function(){return previousCareerPage()+`<div class="card" style="margin-top:18px"><h2>Experience a role before choosing it</h2><p class="mu">Try the live cyber range to investigate incidents as a SOC analyst, DFIR analyst, cloud engineer, AppSec engineer and more.</p><button class="b" onclick="go('range')">Explore nine role simulations →</button></div>`;};

// Beginner orientation and transparent simulation disclosure.
const nexusDash = V.dash;
V.dash = function(){
 return `<section class="card" aria-label="Start learning"><h2>New here? Start with your first investigation</h2><p>1. Learn networking and Linux basics. 2. Complete the SSH log investigation lab. 3. Try the SOC analyst role simulation. 4. Export a case report for your portfolio.</p><p class="mu">All alerts, terminals, CTFs and incidents are fictional training simulations. Progress is stored in this browser only.</p><button class="b" onclick="go('path')">Start the learning path</button> <button class="o" onclick="go('range')">Try a SOC simulation</button></section>`+nexusDash();
};
