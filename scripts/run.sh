#!/usr/bin/env bash
set -euo pipefail

command="${1:-dev}"

case "$command" in
  dev)
    trap 'kill 0' EXIT INT TERM
    npm run dev --prefix backend &
    npm run dev --prefix frontend &
    wait
    ;;
  start)
    trap 'kill 0' EXIT INT TERM
    npm start --prefix backend &
    npm run preview --prefix frontend -- --host 0.0.0.0 &
    wait
    ;;
  *)
    echo "Usage: npm run {dev|start}"
    exit 1
    ;;
esac
