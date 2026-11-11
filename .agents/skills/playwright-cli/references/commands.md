# Repository browser commands

Run commands from the framework root. Replace `task` with one task slug and keep that same `-s` value on every browser command. These are command patterns, with placeholders supplied from approved case data and target configuration. Check installed syntax using `npx --no-install playwright-cli --help <command>`.

## Open, authenticate and navigate

```text
npx --no-install playwright-cli -s=task open <approved-origin>
npx --no-install playwright-cli -s=task state-load auth/<env>/<store>/<locale>/<role>.json
npx --no-install playwright-cli -s=task goto <approved-page-url>
npx --no-install playwright-cli -s=task go-back
npx --no-install playwright-cli -s=task go-forward
npx --no-install playwright-cli -s=task reload
```

Omit state loading for guests. The owner provisions state locally. Do not open its contents or enter credentials in the CLI. Check that the visible account identity and required UI state are correct without recording personal details. Browser, device, profile and emulation options are supported by the installed help. Use only the target configuration authorized for the case.

## Inspect a small scope

```text
npx --no-install playwright-cli -s=task snapshot --depth=4
npx --no-install playwright-cli -s=task snapshot <current-ref>
npx --no-install playwright-cli -s=task find "<non-sensitive UI text>"
npx --no-install playwright-cli -s=task eval "() => document.querySelectorAll('[data-testid=\"cart-checkout\"]').length"
npx --no-install playwright-cli -s=task eval "el => el.getAttribute('data-testid')" <current-ref>
npx --no-install playwright-cli -s=task generate-locator <current-ref> --raw
```

Generated locators are candidates. Apply the owning locator strategy and confirm count, visibility, container and frame before storing one. Raw output removes wrappers and does not redact sensitive values.

## Exercise an approved interaction

```text
npx --no-install playwright-cli -s=task click <current-ref>
npx --no-install playwright-cli -s=task fill <current-ref> "<approved-non-sensitive-input>"
npx --no-install playwright-cli -s=task select <current-ref> "<approved-option>"
npx --no-install playwright-cli -s=task check <current-ref>
npx --no-install playwright-cli -s=task uncheck <current-ref>
npx --no-install playwright-cli -s=task press Enter
npx --no-install playwright-cli -s=task hover <current-ref>
npx --no-install playwright-cli -s=task upload <approved-fixture-path>
npx --no-install playwright-cli -s=task dialog-dismiss
```

Snapshot refs are temporary and must be refreshed after UI changes. Mutations require approved disposable data and cleanup. Do not enter real credentials, tokens or other secrets through these commands.

## Tabs and non-sensitive diagnostics

```text
npx --no-install playwright-cli -s=task tab-list
npx --no-install playwright-cli -s=task tab-new <approved-url>
npx --no-install playwright-cli -s=task tab-select <index>
npx --no-install playwright-cli -s=task tab-close <index>
npx --no-install playwright-cli -s=task requests
npx --no-install playwright-cli -s=task close
```

Request URLs and console messages can contain sensitive identifiers. Capture only sanitized facts. Full request/body/header commands expose credentials and payloads, so never dump them as routine discovery. If correlation requires a non-sensitive identifier, inspect only the relevant field through an authorized read-only check. Never extract token values.

For an explicitly approved mocked scenario use the installed `route`, `route-list` and `unroute` help. Keep mocked results separate from live integration results in the case evidence. Tracing, screenshots and video are optional diagnostic artifacts, kept in ignored local paths. They require review and sanitization before any approved sharing.

## Windows quoting

Quote every URL. In PowerShell, single-quoted URLs preserve query delimiters and literal `$` characters. In cmd.exe, a double-quoted URL preserves `&` within that argument. Avoid piping untrusted page text into shell expressions. For a complex `run-code` expression use a local script and `--filename` after checking the installed help.
