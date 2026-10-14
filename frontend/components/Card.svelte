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
		/** Small coloured label above the title. */
		badge?: string
		/** Chips along the bottom. Left out, a card filled in from GitHub shows the repository's topics, or its language. */
		tags?: string[]
		/** Colour of the badge and the bar shown on hover. */
		accent?: 'gold' | 'teal' | 'violet' | 'green'
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
		accent = 'gold',
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

<article class="card {width}" style:--card-accent="var(--{accent})" {@attach reveal}>
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
		--card-accent-dim: color-mix(in srgb, var(--card-accent) 14%, transparent);

		grid-column: span 4;
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--bg-raised);
		transition:
			opacity 0.65s var(--ease),
			transform 0.3s var(--ease),
			border-color 0.3s,
			box-shadow 0.3s;
	}

	.half {
		grid-column: span 6;
	}

	.full {
		grid-column: 1 / -1;
	}

	.card:hover,
	.card:focus-within {
		border-color: var(--border-hover);
		transform: translateY(-6px);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	/* Accent bar along the top edge */
	.card::before {
		content: '';
		position: absolute;
		inset: 0 0 auto;
		height: 2px;
		z-index: 1;
		background: var(--card-accent);
		opacity: 0;
		transition: opacity 0.3s;
	}

	.card:hover::before,
	.card:focus-within::before {
		opacity: 1;
	}

	.media {
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--bg-surface);
	}

	.media img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s var(--ease);
	}

	.card:hover .media img {
		transform: scale(1.04);
	}

	.body {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 24px;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
		font-family: var(--font-mono);
	}

	.badge {
		padding: 3px 8px;
		border-radius: 2px;
		font-size: 0.65rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--card-accent);
		background: var(--card-accent-dim);
	}

	.source {
		margin-left: auto;
		font-size: 0.7rem;
		color: var(--text-dim);
		transition: color 0.2s;
	}

	.card:hover .source {
		color: var(--text);
	}

	h3 {
		font-family: var(--font-display);
		font-size: 1.4rem;
		font-weight: 600;
		line-height: 1.2;
		margin-bottom: 4px;
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
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		color: var(--text-muted);
	}

	.desc {
		flex: 1;
		margin-top: 10px;
		font-size: 0.88rem;
		font-weight: 300;
		line-height: 1.7;
		color: var(--text-dim);
	}

	.skeleton {
		flex: none;
		height: 3.4em;
		border-radius: 3px;
		background: linear-gradient(var(--border) 0.9em, transparent 0) 0 0.4em / 100% 1.7em;
		animation: pulse 1.4s ease-in-out infinite;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: auto;
		padding-top: 20px;
	}

	.tags li {
		padding: 3px 8px;
		border: 1px solid var(--border);
		border-radius: 2px;
		background: var(--bg-surface);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--text-dim);
	}

	@keyframes pulse {
		50% {
			opacity: 0.4;
		}
	}

	@media (max-width: 1100px) {
		.card {
			grid-column: span 6;
		}

		.half,
		.full {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 900px) {
		.card {
			grid-column: 1 / -1;
		}
	}
</style>
