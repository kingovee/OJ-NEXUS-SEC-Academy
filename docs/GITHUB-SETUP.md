# Publish NEXUS//SEC Academy on GitHub

This project is ready for a normal GitHub repository and GitHub Pages. It contains no build step and has workflows for validation and deployment.

## Option 1: Upload through the GitHub website

1. Sign in to GitHub and create a new repository named `nexus-sec-academy`.
2. Choose whether it should be public or private. Check that your account plan supports the Pages visibility you intend to use.
3. Create the repository **without** adding a README, `.gitignore`, or licence; these are already included here.
4. Extract the project ZIP on your computer.
5. Open the new repository and choose **Add file → Upload files**.
6. Upload the *contents* of the extracted project folder, including `public/`, `docs/`, `.github/`, and the root documentation files. Do not upload only the ZIP itself.
7. Commit the upload to the `main` branch.

If the upload screen does not show hidden files, make sure the `.github` folder is included. The two workflow files inside it are required for automatic validation and Pages deployment.

## Option 2: Push with Git

Install Git, extract the project, open a terminal in the extracted project folder, and run:

```sh
git init -b main
git add .
git commit -m "Initial commit: NEXUS//SEC Academy"
git remote add origin https://github.com/YOUR-USERNAME/nexus-sec-academy.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. The repository must exist first and should be empty when you use these commands. Git may ask you to authenticate through your configured credential manager or browser.

## Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and check the `Deploy GitHub Pages` workflow.
5. When deployment completes, open **Settings → Pages** or the workflow summary to find the site URL.

The workflow runs on pushes to `main` and can also be started manually from the Actions tab. The separate `Validate project` workflow also runs on pull requests to `main`.

## Repository description and topics

Suggested description:

> Browser-based cybersecurity learning academy with defensive tutorials, simulated labs, CTF-style exercises, and role-based incident simulations.

Suggested topics:

`cybersecurity` `cybersecurity-education` `security-awareness` `soc` `incident-response` `ctf` `blue-team` `javascript` `github-pages`

## Before making the repository public

- Review the project content and all documentation.
- Do not commit `.env` files, secrets, personal data, private logs, or credentials.
- Keep the simulation-only and local-progress limitations visible in the README.
- Review the repository's Actions and Pages settings after the first push.
- Consider enabling private vulnerability reporting in **Settings → Security**.


## v1.2 note

The deployable site is inside `public/`. The repository root contains documentation, tests, workflows and a local server. GitHub Pages publishes `public/` only.
