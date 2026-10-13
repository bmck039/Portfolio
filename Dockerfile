# syntax=docker/dockerfile:1

# --- Build the Svelte frontend ---
FROM node:24-slim AS frontend
WORKDIR /src
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# --- Build the Go server ---
FROM golang:1.27-bookworm AS server
WORKDIR /src
COPY server/go.* ./
RUN go mod download
COPY server/ ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/server .

# --- Runtime image ---
FROM ubuntu:24.04
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --system --no-create-home --shell /usr/sbin/nologin app

WORKDIR /app
COPY --from=server /out/server ./server
COPY --from=frontend /src/dist ./public

ENV PORT=8080 \
    STATIC_DIR=/app/public
EXPOSE 8080
USER app

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD ["/app/server", "-healthcheck"]

CMD ["/app/server"]
