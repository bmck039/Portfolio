<script lang="ts">
	import type { Snippet } from 'svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'

	interface Props extends HTMLAnchorAttributes {
		href: string
		variant?: 'primary' | 'secondary'
		children: Snippet
	}

	let { href, variant = 'secondary', children, ...rest }: Props = $props()
</script>

<a class="button {variant}" {href} {...rest}>
	{@render children()}
</a>

<style>
	.button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border: 1px solid transparent;
		border-radius: 999px;
		font-size: 0.9rem;
		font-weight: 500;
		transition:
			background 0.2s,
			border-color 0.2s,
			color 0.2s;
	}

	.primary {
		background: var(--accent);
		color: var(--on-accent);
	}

	.primary:hover {
		background: color-mix(in oklch, var(--accent) 88%, var(--text));
	}

	.secondary {
		border-color: var(--border);
		color: var(--text);
	}

	.secondary:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
</style>
