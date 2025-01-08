#!/bin/bash
set -e

# Initial WASM build
cd /workspace/rust
wasm-pack build --target web

# Start development server and watch Rust files in parallel
cd /workspace/app
(while true; do
  inotifywait -e modify,create,delete -r /workspace/rust/src && {
    echo "Rust changes detected, rebuilding WASM..."
    cd /workspace/rust
    wasm-pack build --target web
    cd /workspace/app
  }
done) &

npm run dev -- --host 