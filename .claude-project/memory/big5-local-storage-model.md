---
id: big5_local_storage_model
type: project
updated: 2026-07-06T17:01:42+09:00
source: src/services/storage.ts
---

# Big5 Local Storage Model

## Memory

There is no database. Profiles are stored as `~/.big5/profiles/{id}.json`; survey sessions are stored as `~/.big5/surveys/{id}.json`. `StorageManager` handles file persistence and Map cache updates. When a survey completes, its session is deleted after profile conversion.

## Why

This is the implemented model in `src/services/storage.ts` and is also described by generated schema/security docs.

## How To Apply

Tests should inject `new StorageManager(baseDir)` with a temporary directory so they never touch the real `~/.big5` path.
