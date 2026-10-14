<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fetchRepo, parseRepo, repoTitle, type Repo } from '../lib/github'
	import { reveal } from '../lib/reveal'

	interface Props {
		/** Heading. Left out, it is filled in from GitHub when `link` is a repository. */
		title?: string
		/** Small line under the title. */
		subtitle?: string
		/** Body text. Left out, it is filled in from GitHub when `link` is a repository. */
		desc?: string
		/** Image shown across the top of the card. */
		img?: string
		alt?: string
		/** Where the card goes when clicked. "github.com/owner/repo" works without the https://. */
		link?: string
		/** Small label above the title, such as a category or dates. */
		badge?: string
		/** Chips along the bottom. Left out, a card filled in from GitHub shows the repository's topics, or its language. */
		tags?: string[]
		/** How much of the section's width the card takes up on a wide screen. */
		width?: 'third' | 'half' | 'full'
		/** Extra content placed under the description. */
		children?: Snippet
	}

	let {
		title,
		subtitle,
		desc,
		img,
		alt = '',
		link,
		badge,
		tags,
		width = 'third',
		children,
	}: Props = $props()

	const href = $derived(link && !/^([a-z][a-z0-9+.-]*:|[/#])/i.test(link) ? `https://${link}` : link)
	const external = $derived(href !== undefined && /^https?:/i.test(href))
	const repoRef = $derived(link ? parseRepo(link) : null)

	// undefined until the lookup finishes, null if GitHub had nothing.
	let repo = $state<Repo | null>()

	$effect(() => {
		if (!repoRef || (title !== undefined && desc !== undefined)) return

		let stale = false
		repo = undefined
		fetchRepo(repoRef).then((found) => {
			if (!stale) repo = found
		})
		return () => {
			stale = true
		}
	})

	const heading = $derived(title ?? repoTitle(repo?.name ?? repoRef?.repo ?? ''))
	const body = $derived(desc ?? repo?.description)
	const loading = $derived(desc === undefined && repoRef !== null && repo === undefined)
	const chips = $derived(tags ?? (repo?.topics.length ? repo.topics : repo?.language ? [repo.language] : []))
	const source = $derived(repoRef ? 'GitHub' : external ? new URL(href!).hostname.replace(/^www\./, '') : '')
</script>

<article class="card {width}" {@attach reveal}>
	{#if img}
		<div class="media">
			<img src={img} {alt} loading="lazy" />
		</div>
	{/if}

	<div class="body">
		{#if badge || source}
			<div class="meta">
				{#if badge}
					<span class="badge">{badge}</span>
				{/if}
				{#if source}
					<span class="source">{source} ↗</span>
				{/if}
			</div>
		{/if}

		{#if heading}
			<h3>
				{#if href}
					<a {href} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>{heading}</a>
				{:else}
					{heading}
				{/if}
			</h3>
		{/if}

		{#if subtitle}
			<p class="subtitle">{subtitle}</p>
		{/if}

		{#if body}
			<p class="desc">{body}</p>
		{:else if loading}
			<p class="desc skeleton" aria-hidden="true"></p>
		{/if}

		{@render children?.()}

		{#if chips.length > 0}
			<ul class="tags">
				{#each chips as chip (chip)}
					<li>{chip}</li>
				{/each}
			</ul>
		{/if}
	</div>
</article>

<style>
	.card {
		grid-column: span 4;
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg-raised);
		transition:
			opacity 0.5s var(--ease),
			translate 0.5s var(--ease),
			border-color 0.2s;
	}

	.half {
		grid-column: span 6;
	}

	.full {
		grid-column: 1 / -1;
	}

	.card:hover,
	.card:focus-within {
		border-color: color-mix(in oklch, var(--accent) 45%, var(--border));
	}

	.media {
		aspect-ratio: 16 / 9;
		overflow: hidden;
		border-bottom: 1px solid var(--border);
		background: var(--bg-surface);
	}

	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: scale 0.4s var(--ease);
	}

	.card:hover .media img {
		scale: 1.02;
	}

	@media (prefers-color-scheme: dark) {
		.media img {
			filter: brightness(0.88);
		}
	}

	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 20px 22px 22px;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 10px;
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	.badge {
		padding: 2px 8px;
		border-radius: 999px;
		font-weight: 500;
		color: var(--accent);
		background: var(--accent-dim);
	}

	.source {
		margin-left: auto;
		color: var(--text-muted);
		transition: color 0.2s;
	}

	.card:hover .source {
		color: var(--accent);
	}

	h3 {
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.3;
		letter-spacing: -0.01em;
		transition: color 0.2s;
	}

	.card:hover h3 {
		color: var(--accent);
	}

	/* Stretch the title link over the whole card so all of it is clickable. */
	h3 a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	h3 a:focus-visible {
		outline: none;
	}

	.subtitle {
		margin-top: 2px;
		font-size: 0.85rem;
		color: var(--text-muted);
	}

	.desc {
		flex: 1;
		margin-top: 10px;
		font-size: 0.92rem;
		line-height: 1.65;
		color: var(--text-dim);
	}

	.skeleton {
		flex: none;
		height: 3.3em;
		border-radius: 4px;
		background: linear-gradient(var(--border) 0.9em, transparent 0) 0 0.35em / 100% 1.65em;
		animation: pulse 1.4s ease-in-out infinite;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: auto;
		padding-top: 18px;
	}

	.tags li {
		padding: 2px 8px;
		border-radius: 6px;
		background: var(--bg-surface);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--text-dim);
	}

	@keyframes pulse {
		50% {
			opacity: 0.4;
		}
	}

	@media (max-width: 1040px) {
		.card {
			grid-column: span 6;
		}

		.half,
		.full {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 720px) {
		.card {
			grid-column: 1 / -1;
		}
	}
</style>
