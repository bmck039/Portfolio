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
	<header {@attach reveal}>
		{#if label}
			<p class="label">{label}</p>
		{/if}
		<h2>{title}</h2>
	</header>

	<div class="items">
		{@render children?.()}
	</div>
</section>

<style>
	section {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 72px var(--gutter);
	}

	section + :global(section) {
		border-top: 1px solid var(--border);
	}

	header {
		margin-bottom: 32px;
	}

	.label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 8px;
	}

	h2 {
		font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2rem);
		font-weight: 600;
		line-height: 1.2;
		letter-spacing: -0.02em;
		text-wrap: balance;
	}

	.items {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		gap: 20px;
	}

	.items > :global(:not(.card)) {
		grid-column: 1 / -1;
	}

	.items > :global(p) {
		max-width: 65ch;
		color: var(--text-dim);
		line-height: 1.75;
	}

	@media (max-width: 680px) {
		section {
			padding-block: 56px;
		}
	}
</style>
