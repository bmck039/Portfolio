<script lang="ts">
	import { site } from '../lib/site'

	let scrollY = $state(0)
	let menuOpen = $state(false)
	let active = $state('')

	const sectionId = (href: string) => href.split('#')[1] ?? ''

	// Highlight the link of whichever section is crossing the middle of the screen.
	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) active = entry.target.id
					else if (active === entry.target.id) active = ''
				}
			},
			{ rootMargin: '-50% 0px -50% 0px' },
		)
		for (const link of site.nav) {
			const section = document.getElementById(sectionId(link.href))
			if (section) observer.observe(section)
		}
		return () => observer.disconnect()
	})
</script>

<svelte:window bind:scrollY onkeydown={(event) => event.key === 'Escape' && (menuOpen = false)} />

<nav class:scrolled={scrollY > 40}>
	<div class="inner">
		<a class="logo" href="/">{site.name.first}<span>.</span></a>

		<ul class="links">
			{#each site.nav as link (link.href)}
				<li><a href={link.href} class:active={active === sectionId(link.href)}>{link.label}</a></li>
			{/each}
			{#if site.resume}
				<li><a class="resume" href={site.resume} target="_blank" rel="noopener">Résumé</a></li>
			{/if}
		</ul>

		<button class="hamburger" aria-label="Open menu" aria-expanded={menuOpen} onclick={() => (menuOpen = true)}>
			<span></span><span></span><span></span>
		</button>
	</div>
</nav>

{#if menuOpen}
	<div class="menu">
		<button class="close" aria-label="Close menu" onclick={() => (menuOpen = false)}>✕</button>
		{#each site.nav as link (link.href)}
			<a href={link.href} onclick={() => (menuOpen = false)}>{link.label}</a>
		{/each}
		{#if site.resume}
			<a href={site.resume} target="_blank" rel="noopener" onclick={() => (menuOpen = false)}>Résumé ↗</a>
		{/if}
	</div>
{/if}

<style>
	nav {
		position: fixed;
		inset: 0 0 auto;
		height: var(--nav-h);
		z-index: 100;
		border-bottom: 1px solid transparent;
		transition:
			background 0.3s var(--ease),
			border-color 0.3s var(--ease);
	}

	nav.scrolled {
		background: color-mix(in srgb, var(--bg) 92%, transparent);
		backdrop-filter: blur(12px);
		border-color: var(--border);
	}

	.inner {
		max-width: var(--max-w);
		height: 100%;
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.logo {
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	.logo span {
		color: var(--accent);
	}

	.links {
		display: flex;
		align-items: center;
		gap: 36px;
	}

	.links a {
		font-family: var(--font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.06em;
		color: var(--text-dim);
		transition: color 0.2s;
	}

	.links a:hover,
	.links a.active {
		color: var(--text);
	}

	.links a.resume {
		padding: 7px 16px;
		border: 1px solid var(--accent);
		border-radius: var(--radius);
		color: var(--accent);
		transition: background 0.2s;
	}

	.links a.resume:hover {
		color: var(--accent);
		background: var(--accent-dim);
	}

	.hamburger {
		display: none;
		flex-direction: column;
		gap: 5px;
		padding: 4px;
		background: none;
		border: none;
		cursor: pointer;
	}

	.hamburger span {
		width: 22px;
		height: 2px;
		background: var(--text);
		border-radius: 2px;
	}

	.menu {
		position: fixed;
		inset: 0;
		z-index: 101;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 36px;
		background: color-mix(in srgb, var(--bg) 97%, transparent);
	}

	.menu a {
		font-family: var(--font-display);
		font-size: 2rem;
		font-weight: 600;
		transition: color 0.2s;
	}

	.menu a:hover {
		color: var(--accent);
	}

	.close {
		position: absolute;
		top: 20px;
		right: 28px;
		font-size: 1.8rem;
		color: var(--text-dim);
		background: none;
		border: none;
		cursor: pointer;
	}

	@media (max-width: 900px) {
		.links {
			display: none;
		}

		.hamburger {
			display: flex;
		}
	}
</style>
