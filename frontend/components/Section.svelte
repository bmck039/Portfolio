<script lang="ts">
	import type { Snippet } from 'svelte'
	import { reveal } from '../lib/reveal'

	interface Props {
		title: string
		/** Small line next to the section number. */
		label?: string
		/** Anchor for navigation links. Defaults to the label (or title) in lowercase. */
		id?: string
		/**
		 * Paragraphs and other content sit in the body column. Cards span the full
		 * width of the grid, and <Note>s sit in the margin beside what follows them.
		 */
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
	<div class="wrap grid">
		<div class="rule" aria-hidden="true"></div>

		<div class="marker" {@attach reveal}>
			<a class="number" href="#{anchor}" aria-label="Link to {label ?? title}"></a>
			{#if label}
				<p class="annot">{label}</p>
			{/if}
		</div>

		<h2 {@attach reveal}>{title}</h2>

		<div class="body">
			{@render children?.()}
		</div>
	</div>
</section>

<style>
	section {
		counter-increment: section;
		padding-block: var(--space-xl) var(--space-2xl);
	}

	.rule {
		grid-column: 1 / -1;
		border-top: 1px solid var(--rule-strong);
		margin-bottom: var(--space-s);
	}

	.marker {
		grid-column: margin;
		display: flex;
		align-items: baseline;
		gap: var(--space-xs);
	}

	.number {
		font-size: var(--step-3);
		font-weight: 350;
		line-height: 1;
		font-variant-numeric: lining-nums tabular-nums;
		color: var(--spot);
	}

	.number::before {
		content: counter(section, decimal-leading-zero);
	}

	/* Permalink mark on hover */
	.number::after {
		content: '¶';
		margin-left: 0.15em;
		font-size: 0.5em;
		vertical-align: 0.4em;
		opacity: 0;
		transition: opacity var(--dur-2);
	}

	.number:hover::after,
	.number:focus-visible::after {
		opacity: 1;
	}

	h2 {
		grid-column: body;
		max-width: 22ch;
		font-size: var(--step-4);
		font-weight: 400;
		line-height: 1.05;
		letter-spacing: -0.015em;
	}

	.body {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
		grid-auto-flow: row dense;
		row-gap: var(--space-l);
		margin-top: var(--space-xl);
	}

	/* Default placement for anything inside a section; components such as
	   Card, Note and Skills set their own columns. */
	:where(.body) > :global(*) {
		grid-column: body;
	}

	.body > :global(p) {
		max-width: var(--measure);
		color: var(--ink-2);
	}

	.body > :global(p + p) {
		margin-top: calc(var(--space-l) * -1 + var(--space-s));
	}

	/* The opening paragraph of each section is set as a larger lede. */
	.body > :global(p:first-child),
	.body > :global(.note:first-child + p) {
		font-size: var(--step-1);
		line-height: 1.45;
		color: var(--ink);
	}

	/* Drop cap on the opening paragraph of the first section. */
	@supports (initial-letter: 3) or (-webkit-initial-letter: 3) {
		section:first-of-type .body > :global(p:first-child::first-letter),
		section:first-of-type .body > :global(.note:first-child + p::first-letter) {
			-webkit-initial-letter: 3;
			initial-letter: 3;
			margin-right: 0.08em;
			font-weight: 500;
			color: var(--spot);
		}
	}

	@media (max-width: 900px) {
		h2 {
			margin-top: var(--space-xs);
		}

		.body {
			margin-top: var(--space-l);
		}
	}
</style>
