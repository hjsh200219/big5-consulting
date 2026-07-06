---
description: Start or continue Big 5 personality assessment workflows through the bundled MCP server.
---

# Big 5 Survey

Use this skill when the user wants to take, resume, or analyze a Big Five personality assessment.

Prefer the plugin-provided MCP survey tool. Ask for the user's name only when starting a new survey and it is not provided. Use `version: "short"` when the user asks for a quick or brief assessment, and `version: "full"` when they ask for a complete or detailed assessment. Use `language: "en"` for English surveys and `language: "ko"` for Korean surveys.

After each batch of questions, submit answers as numbers from 1 to 5 in the same order as the questions shown. When the survey completes, use the returned `profile_id` for follow-up individual, team, or relationship analysis.
