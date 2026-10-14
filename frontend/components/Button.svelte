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
		padding: 12px 28px;
		border: 1px solid transparent;
		border-radius: var(--radius);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.05em;
		transition:
			opacity 0.2s,
			transform 0.2s,
			border-color 0.2s,
			background 0.2s;
	}

	.button:hover {
		transform: translateY(-2px);
	}

	.primary {
		background: var(--accent);
		color: var(--bg);
		font-weight: 500;
	}

	.primary:hover {
		opacity: 0.88;
	}

	.secondary {
		border-color: var(--border-hover);
		color: var(--text);
	}

	.secondary:hover {
		border-color: var(--accent);
		background: var(--accent-dim);
	}
</style>
