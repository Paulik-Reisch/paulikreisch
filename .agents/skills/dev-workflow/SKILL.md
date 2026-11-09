---
name: dev-workflow
description: How we develop in this repository - a branch per change, stringent commits, clean refactored code, tests shipped with every behavior change, and a PR with green CI. Use for every code change, feature, or fix in this repo, whether written by a human or an AI agent.
---

# Development workflow

This is how we work in this repository. Every change follows it, no matter how small.

## Branch

- Never push directly to `main`. Every change, fixes included, gets its own branch from an up-to-date `main`:

  ```sh
  git checkout main && git pull && git checkout -b <short-kebab-description>
  ```

- Name the branch after the change (for example `leseprobe-zoom-dialog-navigation`), not after a person or a date.
- One concern per branch. Do not mix a feature, a fix, and a refactor in the same branch.

## Commits

- Commit early and often. Each commit is one coherent logical step and leaves the repo buildable.
- Subject line in imperative mood, about 72 characters max, stating what the change does: `Add prev/next navigation to the leseprobe zoom dialog`.
- Keep refactors in their own commits, separate from behavior changes.
- No catch-all commits. Unrelated changes go into their own commits or their own branch.

## Code

- TypeScript and ESLint stay clean: `npm run check` (ESLint, TypeScript, unit and architecture tests) passes before every push, and new code adds no new lint warnings.
- Follow the existing structure (see README: `src/app`, `src/components`, `src/lib`). Reuse existing components, tokens, and helpers instead of duplicating them.
- Leave code you touch cleaner than you found it: refactor where it improves clarity, in separate commits from behavior changes.
- No dead code, no commented-out blocks, no leftover debug output, no secrets. Credentials never go into Git, issues, or PRs.
- For non-trivial engineering judgment, load the `principal-engineering` skill and its siblings.

## Tests

- Every behavior change ships its tests in the same change. An empty test diff on a behavior change is unfinished work.
- A bug fix ships a regression test named after the failure mode: red against the unfixed code, green against the fix.
- The `testing-changes` skill defines which tests a change owes; `writing-unit-tests` defines how to write them.
- UI changes are checked at 320, 375, 414, 768 and 1440 px. Changed user flows extend the Playwright e2e suite where it already covers them.
- Before pushing, `npm run check` and `npm run build` pass locally. Run `npm audit` when dependencies change.

## Pull request

- Open a PR into `main`. CI must be green: the Quality workflow (lint, typecheck, unit tests, audit, build, Playwright e2e) and the security workflow (Semgrep, Dependabot).
- The PR description states what changed, why, and how it was verified. Visible UI changes include before/after screenshots.
- Merging into `main` deploys live automatically via Firebase App Hosting. Merge only green, reviewed PRs.
- Squash merge, then delete the branch.

## Documentation

- Technical documentation lives in the repo, in English, and is updated in the same change that alters behavior or structure.
