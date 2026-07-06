#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_DIR="${ROOT_DIR}/claude-code-plugin"
STAGING_DIR="${ROOT_DIR}/.cache/claude-plugin/big5-consulting"
OUTPUT_FILE="${ROOT_DIR}/big5-consulting-claude-plugin.zip"

if ! command -v zip >/dev/null 2>&1; then
  echo "zip is required to build the Claude Code plugin archive" >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "claude is required to validate the Claude Code plugin" >&2
  exit 1
fi

rm -rf "${STAGING_DIR}"
mkdir -p "${STAGING_DIR}"
cp -R "${PLUGIN_DIR}/." "${STAGING_DIR}/"

claude plugin validate "${STAGING_DIR}" --strict

rm -f "${OUTPUT_FILE}"
(cd "${STAGING_DIR}" && zip -qr "${OUTPUT_FILE}" .)

ls -lh "${OUTPUT_FILE}"
