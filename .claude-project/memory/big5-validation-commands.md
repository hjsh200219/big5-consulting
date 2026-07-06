---
id: big5_validation_commands
type: reference
updated: 2026-07-06T17:01:42+09:00
source: package.json
---

# Big5 Validation Commands

## Memory

The standard validation command is `npm test`. It runs `npm run build` and then `node --test tests/**/*.test.js`. As of this Pack, the suite has 6 passing tests covering profile operations, question helpers, reverse scoring, survey language preservation, and schema language options.

## Why

This is defined in `package.json` and was verified on 2026-07-06.

## How To Apply

After code changes, report `npm test` results. If only docs or Pack metadata changed, at minimum run `git diff --check` and explain why broader validation was skipped.
