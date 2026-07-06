---
id: big5_distribution_caveats
type: reference
updated: 2026-07-06T17:01:42+09:00
source: package.json
---

# Big5 Distribution Caveats

## Memory

Distribution channels are npm, Smithery, Claude Desktop MCPB, and Claude Code plugin. `npm run build:mcpb` validates, packs, and prints MCPB info. `npm run build:smithery-mcpb` creates a standard MCPB, injects Smithery tool schemas, and zips it. `npm run build:claude-plugin` requires `zip` and the `claude` CLI, validates the plugin strictly, and creates `big5-consulting-claude-plugin.zip`.

The Claude Code plugin currently runs `npx -y github:hjsh200219/big5-consulting#main`. For release-grade reproducibility, pin this to a tag or commit SHA before publishing.

## Why

These scripts and plugin files were added in the 2026-07-06 distribution work.

## How To Apply

Before deployment or publishing, inspect the relevant script, regenerate the target artifact, and avoid treating old ignored local artifacts as fresh release evidence.
