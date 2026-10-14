<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'
	import Arrow from './Arrow.svelte'

	interface Props extends HTMLAnchorAttributes {
		href: string
		/** Primary links are set in the spot colour. */
		variant?: 'primary' | 'secondary'
		children: Snippet
	}

	let { href, variant = 'secondary', children, ...rest }: Props = $props()
</script>

<a class="button {variant}" {href} {...rest}>
	<span class="label">{@render children()}</span><Arrow />
</a>

<style>
	.button {
		display: inline-flex;
		align-items: baseline;
		font-size: var(--step-1);
		line-height: 1.3;
		transition: color var(--dur-2);
	}

	.label {
		text-decoration: underline;
		text-decoration-color: var(--rule-strong);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		transition: text-decoration-color var(--dur-2);
	}

	.button:hover,
	.button:focus-visible {
		color: var(--spot);
	}

	.button:hover .label,
	.button:focus-visible .label {
		text-decoration-color: currentColor;
	}

	.primary .label {
		text-decoration-color: var(--spot);
	}
</style>
