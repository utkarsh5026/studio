#!/bin/bash
set -e

# Build WASM
cd /workspace/rust
wasm-pack build --target web

# Start development server
cd /workspace/app
npm run dev -- --host 0.0.0.0 