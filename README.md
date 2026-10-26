# Portfolio

The source for [benmckallip.com](https://benmckallip.com): a Svelte and TypeScript frontend served by a small Go server, packaged in one Docker image and published through a Cloudflare Tunnel.

## Layout

```
frontend/
  components/   reusable Svelte components (Section, Card, Skills, Header, ...)
  pages/        one .html file and one .svelte page per page of the site
  lib/          site settings, skills list, styles and helpers
  public/       images and other files copied as-is
  build/        the built site (generated, not committed)
server/         Go server: serves the built pages and a cached GitHub lookup API
cloudflared/    tunnel settings, mounted into the container (git-ignored)
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

## Publishing through Cloudflare

Put one of these in `cloudflared/` (the folder is git-ignored and never built into the image):

- `token`: the tunnel token from the Cloudflare dashboard, or
- `config.yml` and its credentials file (see `cloudflared/config.example.yml`).

The container starts cloudflared as soon as either appears. In the dashboard, the tunnel's public hostname should point to `http://localhost:8080`.

Optionally set `GITHUB_TOKEN` in `.env` to raise the GitHub API rate limit for the project cards.
