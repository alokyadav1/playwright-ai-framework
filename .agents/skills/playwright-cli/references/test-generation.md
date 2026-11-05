# Repository test-development routing

This repository uses Playwright + playwright-bdd and [planner-workflow](../../planner-workflow/SKILL.md). This reference points to action owners; it does not define a second plan/generate/heal pipeline.

| Requested work | Owner |
|---|---|
| Requirements and cases | [test-case-generator](../../test-case-generator/SKILL.md), with planner CP1 before automation |
| Features and steps | [gherkin-bdd](../../gherkin-bdd/SKILL.md) |
| Pages, assertions and fixtures | [page-verification](../../page-verification/SKILL.md) |
| Observed locator candidates | [locator-strategy](../../locator-strategy/SKILL.md) |
| Failure diagnosis | [failure-analysis](../../failure-analysis/SKILL.md) |
| Confirmed addressing repair | [self-healing](../../self-healing/SKILL.md) |

Use [playwright-tests.md](playwright-tests.md) for debug/attach syntax, after checking installed CLI help. Generated interaction code is discovery evidence. Adapt it to repository layers and stored locators/labels; do not paste standalone UI specs with inline credentials or assertions into page objects.

Specifications and approved cases define expected behaviour. The live app establishes current behaviour and implementation details. If they disagree, classify a defect or specification ambiguity; never update expectations merely to match the app.

Use requested case IDs and known setup; do not create a seed test, new spec directory, broad suite run or alternate fixtures because a CLI example shows one. Follow planner-workflow for safe replay, artifacts, approvals and stopping.
