<script lang="ts">
	import type { Snippet } from 'svelte'
	import { reveal } from '../lib/reveal'

	interface Props {
		title: string
		/** Small line above the title. */
		label?: string
		/** Anchor for navigation links. Defaults to the label (or title) in lowercase. */
		id?: string
		/** Cards are laid out in a grid; anything else spans the full width. */
		children?: Snippet
	}

	let { title, label, id, children }: Props = $props()

	const anchor = $derived(
		id ??
			(label ?? title)
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-|-$/g, ''),
	)
</script>

<section id={anchor}>
	<div class="inner">
		<header {@attach reveal}>
			{#if label}
				<p class="label">{label}</p>
			{/if}
			<h2>{title}</h2>
		</header>

		<div class="items">
			{@render children?.()}
		</div>
	</div>
</section>

<style>
	section {
		position: relative;
		z-index: 1;
		padding: 96px 0;
	}

	/* Alternate the background of every other section on the page. */
	section:nth-of-type(even) {
		background: var(--bg-surface);
	}

	.inner {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 0 var(--gutter);
	}

	header {
		margin-bottom: 48px;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 12px;
	}

	h2 {
		font-family: var(--font-display);
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 600;
		line-height: 1.15;
	}

	.items {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 24px;
	}

	.items > :global(:not(.card)) {
		grid-column: 1 / -1;
	}

	.items > :global(p) {
		max-width: 68ch;
		font-weight: 300;
		color: var(--text-dim);
		line-height: 1.8;
	}

	@media (max-width: 680px) {
		section {
			padding: 72px 0;
		}
	}
</style>
