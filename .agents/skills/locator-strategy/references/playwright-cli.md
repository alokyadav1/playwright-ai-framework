# Browser command entry point

Use [the repository browser guide](../../playwright-cli/SKILL.md) and [command patterns](../../playwright-cli/references/commands.md). The command reference covers named sessions, current snapshot refs, approved interactions, non-sensitive checks, tabs, auth state and Windows quoting.

Every browser command uses `npx --no-install playwright-cli -s=<slug>`. Confirm syntax against the installed CLI help. The account owner provisions `auth/<env>/<store>/<locale>/<role>.json`. Snapshots and state remain in ignored local paths. Close only the session created for the task.
