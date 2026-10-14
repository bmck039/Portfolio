<script lang="ts">
	import type { Snippet } from 'svelte'

	/** A margin note, beside whatever follows it inside a <Section>. */
	let { children }: { children: Snippet } = $props()
</script>

<aside class="note">
	{@render children()}
</aside>

<style>
	.note {
		grid-column: margin;
		align-self: start;
		padding-top: var(--space-3xs);
		border-top: 1px solid var(--spot);
		font-family: var(--font-mono);
		font-size: var(--step--2);
		line-height: 1.6;
		color: var(--ink-3);
		text-wrap: pretty;
	}

	@media (max-width: 900px) {
		.note {
			max-width: var(--measure);
		}
	}
</style>
