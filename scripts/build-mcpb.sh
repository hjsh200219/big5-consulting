#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAGING_DIR="${ROOT_DIR}/.cache/mcpb/big5-consulting"
OUTPUT_FILE="${ROOT_DIR}/big5-consulting.mcpb"

rm -rf "${STAGING_DIR}"
mkdir -p "${STAGING_DIR}/server"

cd "${ROOT_DIR}"
npm run build

cp mcpb/manifest.json "${STAGING_DIR}/manifest.json"
cp package.json "${STAGING_DIR}/package.json"
if [[ -f package-lock.json ]]; then
  cp package-lock.json "${STAGING_DIR}/package-lock.json"
fi
cp -R dist "${STAGING_DIR}/server/dist"

cd "${STAGING_DIR}"
if [[ -f package-lock.json ]]; then
  npm ci --omit=dev --ignore-scripts
else
  npm install --omit=dev --ignore-scripts
fi

npx -y @anthropic-ai/mcpb@latest validate manifest.json
npx -y @anthropic-ai/mcpb@latest pack "${STAGING_DIR}" "${OUTPUT_FILE}"
npx -y @anthropic-ai/mcpb@latest info "${OUTPUT_FILE}"
