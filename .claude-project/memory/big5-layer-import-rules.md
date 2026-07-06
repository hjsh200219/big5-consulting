---
id: big5_layer_import_rules
type: project
updated: 2026-07-06T17:01:42+09:00
source: ARCHITECTURE.md
---

# Big5 Layer Import Rules

## Memory

Imports only flow from upper layers to lower layers. `src/types/index.ts` is a leaf node with no internal imports. Tools must not directly import other tools. Shared state goes through `StorageManager`. `src/data/questions.ts` is directly used only by `manageSurvey`.

## Why

This matches `ARCHITECTURE.md`, `docs/design-docs/layer-rules.md`, and the current source layout.

## How To Apply

When adding types, schemas, or tools, update in this order: `types` -> `schemas` -> tool implementation -> `index` handler case.
