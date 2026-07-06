# Big 5 Personality Consulting Claude Code Plugin

This Claude Code plugin installs the Big 5 Consulting MCP server as a plugin-provided MCP server.

## What It Provides

- Big Five personality survey sessions in Korean or English
- Profile CRUD operations
- Individual personality analysis
- Team composition and collaboration analysis
- Relationship compatibility and communication analysis

The MCP server stores survey and profile data locally under `~/.big5`.

## Local Testing

From this repository root:

```bash
claude --plugin-dir ./claude-code-plugin
```

Inside Claude Code:

```text
/mcp
```

The server appears as a plugin-provided MCP server. Tool names use Claude Code's plugin MCP naming convention:

```text
mcp__plugin_big5-consulting_big5-consulting__manage_survey
```

## Example Prompts

```text
Start a short Big 5 survey in English. My name is Alex.
```

```text
한국어로 간략 Big 5 검사를 시작해줘. 이름은 홍길동이야.
```

## Packaging

Use the repository script:

```bash
npm run build:claude-plugin
```

This validates the plugin and writes `big5-consulting-claude-plugin.zip`.

## Runtime Notes

The plugin starts the MCP server through:

```bash
npx -y github:hjsh200219/big5-consulting#main
```

For a fully pinned release, build the zip from a tagged commit and replace `#main` with that tag or commit SHA in `.mcp.json`.
