<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'

	interface Props extends HTMLAnchorAttributes {
		href: string
		/** Primary links are set in the spot colour. */
		variant?: 'primary' | 'secondary'
		children: Snippet
	}

	let { href, variant = 'secondary', children, ...rest }: Props = $props()
</script>

<a class="button {variant}" {href} {...rest}>
	<span class="label">{@render children()}</span>
	<span class="arrow" aria-hidden="true">→</span>
</a>

<style>
	.button {
		display: inline-flex;
		align-items: baseline;
		gap: 0.4em;
		font-size: var(--step-1);
		line-height: 1.3;
	}

	.label {
		background: linear-gradient(currentColor, currentColor) left bottom / 100% 1px no-repeat;
		transition: background-size var(--dur-3) var(--ease-out);
	}

	.button:hover .label {
		background-size: 0% 1px;
		background-position: right bottom;
	}

	.arrow {
		font-family: var(--font-mono);
		font-size: 0.75em;
		transition: translate var(--dur-2) var(--ease-out);
	}

	.button:hover .arrow {
		translate: 0.25em 0;
	}

	.primary {
		color: var(--spot);
	}
</style>
