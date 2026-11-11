# Playwright BDD framework

Use your IDE's built-in coding assistant to turn an FSD into approved cases and verified Playwright scripts.

## Quick start

Requires Node.js 24 and npm. Open the repository root in the IDE.

```bash
npm ci
npx --no-install playwright install chromium
npm run check
npm run test:framework
```

The framework smoke uses an isolated in-memory browser page. It needs no credentials or storefront access. If the Chromium download is unavailable, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a compatible local Chromium executable.

## Apply to a storefront

1. Create a feature branch. Put an FSD in `docs/fsd` and ask the assistant to follow `AGENTS.md`. Review the requirements and cases at CP1.
2. Copy `.env.example` to `.env`. Set `TEST_ENV`, `STORE`, `LOCALE`, and approved test URLs. The packaged URLs and data values are placeholders. Supply approved sandbox data and encrypt secrets locally with `npm run secret:encrypt`.
3. For protected browser discovery, the account owner signs in manually in an authorized named CLI session. Create the parent folders, then save state with `npx --no-install playwright-cli -s=task state-save auth/<env>/<store>/<locale>/<role>.json`. Keep it local and refresh it when expired.
4. Run `npm run agent:preflight -- <scope.json>` and `npm run agent:verify -- <scope.json>`. See `tests/framework/scope.json` and the planner for the manifest. Case IDs go in scenario titles.

The ZIP includes reusable storefront page objects, step bindings, labels and data-key shapes. It includes a local smoke scenario. Bring your own storefront FSDs, cases and features. Existing step phrases remain available for reuse.

## Outputs

- Requirements and cases can be tracked. Browser state, raw snapshots, reports and local run state are ignored.
- Case results are in `playwright-report/agent/agent-summary.json`. Keep raw reports, traces and screenshots private. Share sanitized excerpts.
- Runs default to one worker and zero retries. Increase concurrency after proving isolation and cleanup for mutable test data.
- CI runs the static checks and local smoke. A live storefront requires separately authorized context and data.

## Validate an IDE assistant

Use a fresh coding session and a small FSD on a feature branch. Confirm that the assistant stops after producing cases for CP1. Approve the cases, then leave one required input pending to exercise CP2. After supplying it, verify the title IDs, module ownership and outcome-to-assertion mapping. Repeat the same request and check for duplicate cases and steps. Run this exercise once in each IDE you support.

For a runner negative control, set `FRAMEWORK_NEGATIVE_CONTROL=1` and run `npm run test:framework`. The framework smoke should fail and the summary should report `FW_001` as failed. Clear that variable before the next normal run.
