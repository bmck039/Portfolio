export interface RepoRef {
	owner: string
	repo: string
}

/** Repository details returned by the Go server's /api/github endpoint. */
export interface Repo {
	name: string
	description: string
	html_url: string
	topics: string[]
	language: string
}

const repoUrl = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/\s?#]+)\/([^/\s?#]+)/i

/** Picks the owner and repository out of a GitHub link, or returns null for any other link. */
export function parseRepo(link: string): RepoRef | null {
	const match = repoUrl.exec(link.trim())
	if (!match) return null
	return { owner: match[1], repo: match[2].replace(/\.git$/, '') }
}

/** Turns a repository name like "my-cool_project" into "my cool project". */
export function repoTitle(name: string): string {
	return name.replace(/[-_]+/g, ' ').trim()
}

const lookups = new Map<string, Promise<Repo | null>>()

/** Looks a repository up once per page load. Resolves to null if it can't be found. */
export function fetchRepo({ owner, repo }: RepoRef): Promise<Repo | null> {
	const key = `${owner}/${repo}`.toLowerCase()
	let lookup = lookups.get(key)
	if (!lookup) {
		lookup = fetch(`/api/github/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`)
			.then((response) => (response.ok ? (response.json() as Promise<Repo>) : null))
			.catch(() => null)
		lookups.set(key, lookup)
	}
	return lookup
}
