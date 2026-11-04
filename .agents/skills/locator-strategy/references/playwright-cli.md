# playwright-cli cheat-sheet

Commands below match the Playwright "Coding agents" documentation at the time of writing. Run `playwright-cli --help` for your installed version. If installed locally use `npx playwright-cli ...` (some versions document `npx playwright cli ...`).

## Install

```bash
npm install -D @playwright/cli@latest
npx playwright-cli install --skills=agents   # installs the official skill beside ours; confirm the flag with --help
```

## Sessions (isolate each task)

```bash
playwright-cli -s=<slug> open https://example.com   # named session, headless by default
playwright-cli open <url> --headed                  # watch it
playwright-cli list                                 # sessions
playwright-cli close-all                            # always close when done
playwright-cli show                                 # live dashboard of sessions
```

A headless session closes itself after an hour of inactivity. Close sessions you open.

## Look

```bash
playwright-cli snapshot                       # accessibility snapshot with element refs (e1, e2, ...)
playwright-cli snapshot --filename=<path>     # save to a specific file
playwright-cli snapshot --depth=3             # smaller output
playwright-cli snapshot <ref|selector>        # one element
playwright-cli find "<text or regex>"         # search the snapshot (available in recent versions)
playwright-cli screenshot --filename=<path>
```

## Act

```bash
playwright-cli goto <url>
playwright-cli click <ref>                    # refs from the snapshot
playwright-cli click "role=button[name=Submit]"   # or a CSS / role selector
playwright-cli fill <ref> <text>
playwright-cli select <ref> <value>
playwright-cli check <ref>
playwright-cli press Enter
```

Do not `fill` real credentials. Use saved state instead.

## Verify

```bash
playwright-cli eval "() => document.querySelectorAll('[data-testid=\"cart-checkout\"]').length"
playwright-cli run-code "<playwright code snippet>"
playwright-cli console                        # console messages
```

## Network (for the wait registry)

```bash
playwright-cli requests                       # list requests since page load
playwright-cli request <n>                    # full details of one request
```

## Storage state

```bash
playwright-cli state-load auth/<role>.json    # reuse a framework login state
playwright-cli state-save <file>              # only to a gitignored path
```

State files contain live session tokens. Keep them out of git and out of the chat.

## Evidence

```bash
playwright-cli tracing-start
playwright-cli tracing-stop
```
