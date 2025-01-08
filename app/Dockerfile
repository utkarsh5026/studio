# Builder stage for Rust/Wasm
FROM rust:1.75-slim AS wasm-builder

# Install wasm-pack and dependencies
RUN apt-get update && apt-get install -y \
    curl \
    pkg-config \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Set working directory
WORKDIR /usr/src/app

# Copy Rust project files
COPY rust ./rust

# Build the WebAssembly package
WORKDIR /usr/src/app/rust
RUN wasm-pack build --target web

# Node builder stage
FROM node:20 AS node-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Copy Wasm build from previous stage
COPY --from=wasm-builder /usr/src/app/rust/pkg ./public/wasm

# Build the Vite application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the built assets from node-builder
COPY --from=node-builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]