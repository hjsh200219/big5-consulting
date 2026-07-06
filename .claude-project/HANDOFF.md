---
created: 2026-07-06T17:01:42+09:00
project: big5-consulting
summary: Pack handoff after English survey, Smithery/MCPB, and Claude Code plugin distribution work.
---

# HANDOFF

## Session Digest

- Latest pushed work on `main`:
  - `75e53da feat: add Claude plugin distribution`
  - `a8f0e8c feat: add English survey support`
  - `b1e4953 chore(smithery): add MCPB publishing`
- The repo supports npm, Smithery, Claude Desktop MCPB, and Claude Code plugin distribution paths.
- The survey supports Korean and English display text while preserving the same question numbers and scoring behavior.
- Pack metadata in this session updates `AGENTS.md`, this handoff, and `.claude-project/memory/`.

## Current State

- Branch: `main`
- Remote: `origin/main`
- Blockers: none
- Local ignored artifacts may exist after packaging/build checks:
  - `dist/`
  - `.cache/`
  - `big5-consulting.mcpb`
  - `big5-consulting-smithery.mcpb`
  - `big5-consulting-claude-plugin.zip`

## Completed Work

- English survey support:
  - Added `SurveyLanguage = 'ko' | 'en'`.
  - Added `manage_survey.language` schema enum.
  - Added English question text in `src/data/questions.ts`.
  - Preserved language across survey start, submit, and resume.
  - Split survey instructions by language.
- Test coverage:
  - `tests/questions.test.js` verifies English question text and reverse scoring behavior.
  - `tests/survey-language.test.js` verifies English survey persistence.
  - `tests/profile.test.js` verifies profile CRUD and metadata merge behavior.
- Smithery/MCPB:
  - Added `mcpb/manifest.json`.
  - Added `scripts/build-mcpb.sh`.
  - Added `scripts/build-smithery-mcpb.sh`.
  - Added `smithery.yaml` for stdio execution via `node dist/index.js`.
- Claude Code plugin:
  - Added `claude-code-plugin/.claude-plugin/plugin.json`.
  - Added `claude-code-plugin/.mcp.json`.
  - Added `claude-code-plugin/skills/big5-survey/SKILL.md`.
  - Added `scripts/build-claude-plugin.sh`.
  - Documented installation and distribution paths in `README.md`.

## Validation Evidence

- `npm test` passed on 2026-07-06:
  - runs `npm run build`
  - runs `node --test tests/**/*.test.js`
  - result: 6 tests passed
- `git diff --check` passed.
- Hygiene check found no tracked generated artifacts, no hardcoded secret candidates, and no `debugger`/debug logging leftovers.

## Next Steps

1. For a release-grade Claude Code plugin zip, pin `claude-code-plugin/.mcp.json` from `github:hjsh200219/big5-consulting#main` to a tag or commit SHA.
2. Before publishing, regenerate the desired artifact with the matching command:
   - `npm run build:mcpb`
   - `npm run build:smithery-mcpb`
   - `npm run build:claude-plugin`
3. If publishing to Smithery, use:
   - `npx -y @smithery/cli@latest mcp publish ./big5-consulting-smithery.mcpb -n hjsh200219/big5-consulting`
4. Review `src/schemas/index.ts` answer batch schema vs `SurveyManager.submit()` behavior: schema currently says exactly 5 answers, while implementation allows 1 to 5 answers.
5. Review `docs/RELIABILITY.md`; its older "tests not implemented" wording may no longer match the current test suite.

## Watch Out

- `build:claude-plugin` requires local `claude` CLI and `zip`.
- Smithery MCPB uses a postprocessed manifest with tool schemas injected for Smithery compatibility.
- MCPB signing warnings are expected unless a signing flow is added.
- Do not commit generated package artifacts unless the release process explicitly changes.
