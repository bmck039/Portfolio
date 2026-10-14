<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		title: string
		/** Second, lighter line of the heading. Also drawn large and faint in the background. */
		subtitle?: string
		/** Small line above the heading. */
		eyebrow?: string
		desc?: string
		/** Call-to-action buttons. */
		children?: Snippet
	}

	let { title, subtitle, eyebrow, desc, children }: Props = $props()
</script>

<section class="hero">
	{#if subtitle}
		<div class="backdrop" aria-hidden="true">{subtitle}</div>
	{/if}

	<div class="inner">
		{#if eyebrow}
			<p class="eyebrow">{eyebrow}</p>
		{/if}
		<h1>
			<span class="title">{title}</span>
			{#if subtitle}
				<span class="subtitle">{subtitle}</span>
			{/if}
		</h1>
		{#if desc}
			<p class="desc">{desc}</p>
		{/if}
		{#if children}
			<div class="actions">
				{@render children()}
			</div>
		{/if}
	</div>

	<div class="scroll-hint" aria-hidden="true">
		<span>Scroll</span>
		<div class="line"></div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.inner {
		position: relative;
		width: 100%;
		max-width: var(--max-w);
		margin: 0 auto;
		padding: var(--nav-h) var(--gutter) 0;
	}

	.inner > * {
		animation: fade-up 0.9s var(--ease) backwards;
	}

	.eyebrow {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 20px;
		animation-delay: 0.2s;
	}

	h1 {
		font-family: var(--font-display);
		line-height: 1;
		margin-bottom: 32px;
		animation-delay: 0.35s;
	}

	.title {
		display: block;
		font-size: clamp(3.5rem, 10vw, 8rem);
		font-weight: 600;
		letter-spacing: -0.01em;
		margin-bottom: 8px;
	}

	.subtitle {
		display: block;
		font-size: clamp(2rem, 6vw, 4.8rem);
		font-weight: 300;
		font-style: italic;
		color: var(--text-dim);
	}

	.desc {
		max-width: 520px;
		font-weight: 300;
		color: var(--text-dim);
		line-height: 1.75;
		margin-bottom: 44px;
		animation-delay: 0.5s;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
		animation-delay: 0.65s;
	}

	.backdrop {
		position: absolute;
		top: 50%;
		right: -4%;
		transform: translateY(-50%);
		font-family: var(--font-display);
		font-size: clamp(12rem, 25vw, 22rem);
		font-weight: 600;
		line-height: 1;
		white-space: nowrap;
		color: rgba(255, 255, 255, 0.018);
		pointer-events: none;
		user-select: none;
	}

	.scroll-hint {
		position: absolute;
		bottom: 36px;
		left: 50%;
		translate: -50% 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font-family: var(--font-mono);
		font-size: 0.65rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-muted);
		animation: fade-up 1s var(--ease) 1.2s backwards;
	}

	.line {
		width: 1px;
		height: 36px;
		background: linear-gradient(to bottom, var(--text-muted), transparent);
		animation: pulse 2s ease-in-out 2s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.3;
			transform: scaleY(0.8);
		}
		50% {
			opacity: 1;
			transform: scaleY(1);
		}
	}
</style>
