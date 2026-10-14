<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fetchRepo, parseRepo, repoTitle, type Repo } from '../lib/github'
	import { reveal } from '../lib/reveal'
	import Arrow from './Arrow.svelte'

	interface Props {
		/** Heading. Left out, it is filled in from GitHub when `link` is a repository. */
		title?: string
		/** Small line under the title. */
		subtitle?: string
		/** Body text. Left out, it is filled in from GitHub when `link` is a repository. */
		desc?: string
		/** Image, set as a numbered figure. */
		img?: string
		alt?: string
		/** Text after the figure number under the image. */
		caption?: string
		/** Where the card goes when clicked. "github.com/owner/repo" works without the https://. */
		link?: string
		/** Small label above the title, such as a category or dates. Full-width cards without an image put it in the margin. */
		badge?: string
		/** Keywords listed along the bottom. Left out, a card filled in from GitHub shows the repository's topics, or its language. */
		tags?: string[]
		/** Share of the grid on a wide screen. A full-width card with an image becomes a side-by-side spread. */
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
		caption,
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
	const meta = $derived([...chips, ...(source ? [source] : [])])
</script>

<article class="card {width}" class:plated={img} {@attach reveal}>
	{#if img}
		<figure class="plate">
			<div class="mat">
				<img src={img} {alt} loading="lazy" />
			</div>
			<figcaption><span class="annot number"></span>{caption ?? ''}</figcaption>
		</figure>
	{/if}

	{#if badge}
		<p class="kicker annot">{badge}</p>
	{/if}

	<div class="text">
		{#if heading}
			<h3>
				{#if href}
					<a {href} target={external ? '_blank' : undefined} rel={external ? 'noopener' : undefined}>
						<span class="title">{heading}</span>{#if external}<Arrow />{/if}
					</a>
				{:else}
					<span class="title">{heading}</span>
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

		{#if meta.length > 0}
			<p class="meta annot">
				{#each meta as item, i (i)}{#if i > 0}<span class="dot" aria-hidden="true"> · </span>{/if}{item}{/each}
			</p>
		{/if}
	</div>
</article>

<style>
	.card {
		grid-column: span 4;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
		padding-top: var(--space-xs);
		border-top: 1px solid var(--rule-strong);
	}

	.half {
		grid-column: span 6;
	}

	/* Full width: a spread. The plate takes seven columns and the text the rest;
	   without a plate the badge sits in the margin and the text in the body. */
	.full {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
		align-items: start;
	}

	.full .kicker {
		grid-column: margin;
	}

	.full .text {
		grid-column: body;
	}

	.full.plated .plate {
		grid-column: 1 / 8;
		grid-row: 1 / span 2;
	}

	.full.plated .kicker,
	.full.plated .text {
		grid-column: 8 / -1;
	}

	.plate {
		counter-increment: figure;
		margin-bottom: var(--space-2xs);
	}

	.mat {
		overflow: hidden;
		padding: var(--space-3xs);
		background: var(--mat);
		transition:
			translate var(--dur-3) var(--ease-out),
			box-shadow var(--dur-3) var(--ease-out);
	}

	.mat img {
		width: 100%;
		aspect-ratio: 3 / 2;
		object-fit: cover;
		/* White backgrounds take on the paper (or mat) colour, like a printed plate. */
		mix-blend-mode: multiply;
	}

	.card:hover .mat {
		translate: 0 -2px;
		box-shadow: 0 10px 24px -16px oklch(0.2 0.02 60 / 0.45);
	}

	/* Same caption style as Fig. 1 in the masthead. */
	figcaption {
		margin-top: var(--space-2xs);
		font-size: var(--step--1);
		color: var(--ink-2);
	}

	.number {
		margin-right: 0.75em;
		color: var(--ink);
	}

	.number::before {
		content: 'Fig. ' counter(figure);
	}

	.kicker {
		color: var(--spot);
	}

	h3 {
		font-size: var(--step-2);
		font-weight: 450;
		line-height: 1.12;
		letter-spacing: -0.01em;
	}

	.title {
		background: linear-gradient(var(--spot), var(--spot)) left bottom / 0% 1px no-repeat;
		box-decoration-break: clone;
		-webkit-box-decoration-break: clone;
		transition:
			background-size var(--dur-3) var(--ease-out),
			color var(--dur-2);
	}

	.card:hover .title,
	.card:focus-within .title {
		background-size: 100% 1px;
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

	.card:has(h3 a:focus-visible) {
		outline: 2px solid var(--spot);
		outline-offset: 6px;
	}

	.subtitle {
		margin-top: 0.15em;
		color: var(--ink-3);
	}

	.desc {
		margin-top: var(--space-2xs);
		max-width: var(--measure);
		color: var(--ink-2);
	}

	.skeleton {
		height: 3em;
		background: linear-gradient(var(--rule) 1px, transparent 0) 0 0.75em / 100% 1.5em;
		animation: shimmer 1.6s var(--ease-in-out) infinite;
	}

	.meta {
		margin-top: var(--space-xs);
	}

	.dot {
		color: var(--rule-strong);
	}

	@keyframes shimmer {
		50% {
			opacity: 0.35;
		}
	}

	@media (max-width: 1100px) {
		.card {
			grid-column: span 6;
		}

		.half {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 900px) {
		.card,
		.full.plated .plate,
		.full.plated .kicker,
		.full.plated .text {
			grid-column: 1 / -1;
			grid-row: auto;
		}
	}
</style>
