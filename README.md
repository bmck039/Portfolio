# Portfolio

The source for [benmckallip.com](https://benmckallip.com): a Svelte and TypeScript frontend served by a small Go server, packaged in a Docker image and published through a Cloudflare Tunnel. [doco-cd](https://github.com/kimdre/doco-cd) deploys each stable release.

## Layout

```
frontend/
  components/   reusable Svelte components (Section, Card, Skills, Header, ...)
  pages/        one .html file and one .svelte page per page of the site
  lib/          site settings, skills list, styles and helpers
  public/       images and other files copied as-is
  build/        the built site (generated, not committed)
server/         Go server: serves the built pages and a cached GitHub lookup API
```

## Editing content

- Name, role, summary, location, contact links and footer text: `frontend/lib/site.ts`
- Skills and their categories: `frontend/lib/skills.ts`
- Sections, projects and experience: `frontend/pages/Home.svelte`

A `<Card>` with a GitHub `link` and no `title` or `desc` fills them in from the repository. The server only looks up repositories owned by the accounts in `githubOwners` (`server/github.go`), so add the owner there when a card links to a new one.

## Running

Locally, with hot reload:

```sh
cd server && go run .          # API and built pages on :8080
cd frontend && npm install && npm run dev
```

In Docker:

```sh
docker compose up -d --build   # site on http://localhost:8080
docker compose logs -f
```

Settings live in `.env` (git-ignored, optional):

```sh
TUNNEL_TOKEN=...    # Cloudflare Zero Trust -> Networks -> Tunnels -> your tunnel -> token
GITHUB_TOKEN=...    # optional, raises the GitHub API rate limit for the project cards
```

## Publishing through Cloudflare

The `tunnel` service runs cloudflared with `TUNNEL_TOKEN` from `.env`. It shares the `web`
container's network, so in the dashboard the tunnel's public hostname should point to
`http://localhost:8080`. Without a token the site still runs locally; cloudflared just
restarts until one is set.

## Deploying (automatic updates with doco-cd)

On the server, doco-cd keeps the stack on the latest stable release. Every push to
`master` runs the checks in [`.github/workflows/release.yml`](.github/workflows/release.yml)
(frontend type check and build, `go vet` and build, and a Docker build that must serve the
site). Publishing a GitHub release runs them too and, if they pass and it is the latest
stable release, moves the `release` branch to it. doco-cd follows that branch and runs the
equivalent of `docker compose up -d --build`, so code, `Dockerfile` and `compose.yaml`
changes all apply. Plain commits and pre-releases deploy nothing, and cloudflared is
updated to its latest image at each deploy.

With a doco-cd instance that mounts a `secrets/` folder at `/secrets`, add this repo to its
`POLL_CONFIG`:

```yaml
        - url: https://github.com/bmck039/Portfolio.git
          reference: release
          interval: 15m
```

and put this project's `.env` at `secrets/portfolio.env` ([`.doco-cd.yml`](.doco-cd.yml)
points the stack at it). If a stack started by hand with `docker compose up` is running,
stop it first (`docker compose down`).

**To ship a change:** push it, then publish a GitHub release (e.g. tag `v1.0.0`).
