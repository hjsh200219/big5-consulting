#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STANDARD_STAGING_DIR="${ROOT_DIR}/.cache/mcpb/big5-consulting"
PUBLISH_STAGING_DIR="${ROOT_DIR}/.cache/mcpb/big5-consulting-smithery"
OUTPUT_FILE="${ROOT_DIR}/big5-consulting-smithery.mcpb"

if ! command -v zip >/dev/null 2>&1; then
  echo "zip is required to build the Smithery publish bundle" >&2
  exit 1
fi

"${ROOT_DIR}/scripts/build-mcpb.sh"

rm -rf "${PUBLISH_STAGING_DIR}"
cp -R "${STANDARD_STAGING_DIR}" "${PUBLISH_STAGING_DIR}"

ROOT_DIR="${ROOT_DIR}" PUBLISH_STAGING_DIR="${PUBLISH_STAGING_DIR}" node <<'NODE'
const fs = require("fs");
const path = require("path");

const rootDir = process.env.ROOT_DIR;
const stagingDir = process.env.PUBLISH_STAGING_DIR;
const manifestPath = path.join(stagingDir, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const { getToolSchemas } = require(path.join(rootDir, "dist", "schemas"));

// Smithery's publish API requires inputSchema in serverCard.tools, while the
// MCPB manifest validator currently only allows name/description there.
manifest.tools = getToolSchemas();
delete manifest.tools_generated;

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Injected ${manifest.tools.length} Smithery tool schemas`);
NODE

rm -f "${OUTPUT_FILE}"
(cd "${PUBLISH_STAGING_DIR}" && zip -qr "${OUTPUT_FILE}" .)

ls -lh "${OUTPUT_FILE}"
