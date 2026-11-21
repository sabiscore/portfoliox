#!/usr/bin/env bash
set -euo pipefail

export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
export BROWSERSLIST_IGNORE_OLD_DATA=1

export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  if [ -f ".nvmrc" ]; then
    nvm use --silent >/dev/null 2>&1 || nvm use 22 --silent >/dev/null 2>&1 || true
  else
    nvm use 22 --silent >/dev/null 2>&1 || true
  fi
fi

exec node scripts/validate-build.mjs "$@"
