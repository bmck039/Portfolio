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
			transform var(--dur-2) var(--ease-out),
			color var(--dur-2);
		/* Keep the arrow on its own layer so the move is drawn at sub-pixel
		   positions instead of snapping (and jumping when it settles). */
		will-change: transform;
	}

	:global(a:hover) .arrow,
	:global(a:focus-visible) .arrow {
		color: var(--spot);
	}

	/* Each arrow moves straight along the direction it points. */
	:global(a:hover) .out,
	:global(a:focus-visible) .out {
		transform: translate(0.15em, -0.15em);
	}

	:global(a:hover) .up,
	:global(a:focus-visible) .up {
		transform: translateY(-0.2em);
	}
</style>
