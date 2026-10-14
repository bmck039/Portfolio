<script lang="ts">
	/**
	 * The arrow after a link: out (↗) for links that go somewhere, up (↑) for
	 * back to top. It's drawn rather than typed, so it looks the same on every
	 * system, and it's sized and seated like a lowercase letter: x-height tall,
	 * on the baseline. On hover it brightens and nudges the way it points.
	 */
	let { direction = 'out' }: { direction?: 'out' | 'up' } = $props()
</script>

<svg class="arrow {direction}" viewBox="0 0 10 10" aria-hidden="true">
	{#if direction === 'up'}
		<path d="M5 9.4V0.8M1.6 4.2L5 0.8L8.4 4.2" />
	{:else}
		<path d="M0.8 9.2L9.2 0.8M3.2 0.8H9.2V6.8" />
	{/if}
</svg>

<style>
	.arrow {
		display: inline-block;
		flex-shrink: 0;
		/* Newsreader's x-height. The bottom edge sits on the text's baseline,
		   both inline and in flex rows aligned to the baseline. */
		width: 0.52em;
		height: 0.52em;
		margin-left: 0.3em;
		vertical-align: baseline;
		overflow: visible;
		fill: none;
		stroke: var(--ink-3);
		stroke-width: 1.15;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition:
			transform var(--dur-2) var(--ease-out),
			stroke var(--dur-2);
		/* Keep the arrow on its own layer so the move is drawn at sub-pixel
		   positions instead of snapping (and jumping when it settles). */
		will-change: transform;
	}

	:global(a:hover) .arrow,
	:global(a:focus-visible) .arrow {
		stroke: var(--spot);
	}

	/* Each arrow moves straight along the direction it points. */
	:global(a:hover) .out,
	:global(a:focus-visible) .out {
		transform: translate(0.08em, -0.08em);
	}

	:global(a:hover) .up,
	:global(a:focus-visible) .up {
		transform: translateY(-0.1em);
	}
</style>
