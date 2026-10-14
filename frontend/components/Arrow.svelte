<script lang="ts">
	/**
	 * The arrow after a link: ↗ for links that go somewhere, ↑ for back to top.
	 * It brightens and nudges in its direction when its link is hovered or focused.
	 */
	let { direction = 'out' }: { direction?: 'out' | 'up' } = $props()
</script>

<span class="arrow {direction}" aria-hidden="true">{direction === 'up' ? '↑' : '↗'}</span>

<style>
	.arrow {
		display: inline-block;
		margin-left: 0.3em;
		font-family: var(--font-mono);
		font-size: 0.7em;
		line-height: 1;
		color: var(--ink-3);
		transition:
			translate var(--dur-2) var(--ease-out),
			color var(--dur-2);
	}

	:global(a:hover) .arrow,
	:global(a:focus-visible) .arrow {
		color: var(--spot);
	}

	:global(a:hover) .out,
	:global(a:focus-visible) .out {
		translate: 0.12em -0.12em;
	}

	:global(a:hover) .up,
	:global(a:focus-visible) .up {
		translate: 0 -0.15em;
	}
</style>
