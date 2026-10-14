<script lang="ts">
	import { site } from '../lib/site'
	import Button from './Button.svelte'

	interface Props {
		/** Show the name, role and summary above the bar. Pages without it get just the bar. */
		intro?: boolean
	}

	let { intro = true }: Props = $props()

	let scrollY = $state(0)
	let introHeight = $state(0)
	let active = $state('')
	let tabs = $state<HTMLUListElement>()

	// 0 at the top of the page, 1 once the intro has scrolled away and only the bar is left.
	const collapse = $derived(introHeight > 0 ? Math.min(Math.max(scrollY / introHeight, 0), 1) : 1)

	const sectionId = (href: string) => href.split('#')[1] ?? ''
	const isExternal = (href: string) => /^https?:/.test(href)

	// Highlight the tab of whichever section is crossing the middle of the screen.
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

	// On narrow screens the tabs scroll sideways; keep the active one in view.
	$effect(() => {
		const tab = active && tabs?.querySelector<HTMLElement>(`[href$="#${active}"]`)
		if (!tab || !tabs) return
		const { offsetLeft, offsetWidth } = tab
		if (offsetLeft < tabs.scrollLeft || offsetLeft + offsetWidth > tabs.scrollLeft + tabs.clientWidth) {
			tabs.scrollTo({ left: offsetLeft - 16, behavior: 'smooth' })
		}
	})
</script>

<svelte:window bind:scrollY />

<!--
	The header is sticky with a negative top equal to the intro's height, so it
	scrolls normally until only the bar is left on screen and then stays put.
	Its height never changes, so nothing below it shifts while it collapses.
-->
<header style:top="{-introHeight}px" style:--collapse={collapse} class:stuck={collapse >= 1}>
	{#if intro}
		<div class="intro" bind:offsetHeight={introHeight}>
			<div class="intro-inner">
				<p class="role">{site.role}</p>
				<h1>{site.name}</h1>
				<p class="summary">{site.summary}</p>
				<div class="actions">
					{#each site.links as link, i (link.label)}
						<Button
							href={link.href}
							variant={i === 0 ? 'primary' : 'secondary'}
							target={isExternal(link.href) ? '_blank' : undefined}
							rel={isExternal(link.href) ? 'noopener' : undefined}>{link.label}</Button
						>
					{/each}
					{#if site.resume}
						<Button href={site.resume} target="_blank" rel="noopener">Résumé</Button>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<nav aria-label="Main">
		<div class="bar">
			<a class="brand" href="/" tabindex={intro && collapse < 1 ? -1 : undefined}>{site.name}</a>
			<ul class="tabs" bind:this={tabs}>
				{#each site.nav as link (link.href)}
					<li>
						<a href={link.href} aria-current={active === sectionId(link.href) ? 'location' : undefined}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			<ul class="contact">
				{#each site.links as link (link.label)}
					<li>
						<a
							href={link.href}
							target={isExternal(link.href) ? '_blank' : undefined}
							rel={isExternal(link.href) ? 'noopener' : undefined}>{link.label}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</nav>
</header>

<style>
	header {
		/* Brand fades in over the last stretch of the collapse. */
		--brand: clamp(0, (var(--collapse) - 0.55) / 0.45, 1);

		position: sticky;
		z-index: 10;
	}

	.intro-inner,
	.bar {
		max-width: var(--max-w);
		margin: 0 auto;
		padding-inline: var(--gutter);
	}

	.intro-inner {
		padding-block: clamp(48px, 9vh, 96px) 36px;
		opacity: calc(1 - var(--collapse) * 1.3);
		translate: 0 calc(var(--collapse) * 24px);
		transform-origin: left bottom;
		scale: calc(1 - var(--collapse) * 0.04);
	}

	.role {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 500;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
		margin-bottom: 12px;
	}

	h1 {
		font-size: clamp(2.25rem, 1rem + 5.2vw, 4.5rem);
		font-weight: 650;
		line-height: 1.05;
		letter-spacing: -0.04em;
		white-space: nowrap;
	}

	.summary {
		max-width: 56ch;
		margin-top: 16px;
		font-size: clamp(1rem, 0.95rem + 0.3vw, 1.15rem);
		color: var(--text-dim);
		text-wrap: pretty;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-top: 24px;
	}

	nav {
		height: var(--bar-h);
		border-bottom: 1px solid var(--border);
		background: var(--bg);
		transition:
			background 0.2s,
			box-shadow 0.2s;
	}

	.stuck nav {
		background: color-mix(in oklch, var(--bg) 82%, transparent);
		backdrop-filter: blur(14px) saturate(1.4);
		box-shadow: 0 6px 24px -18px oklch(0 0 0 / 0.5);
	}

	.bar {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.brand {
		flex-shrink: 0;
		max-width: calc(var(--brand) * 14rem);
		margin-right: calc(var(--brand) * 28px);
		overflow: hidden;
		white-space: nowrap;
		font-weight: 650;
		letter-spacing: -0.02em;
		opacity: var(--brand);
	}

	.tabs {
		display: flex;
		gap: 4px;
		min-width: 0;
		margin-inline: -10px;
		padding-inline: 10px;
		overflow-x: auto;
		scrollbar-width: none;
		mask-image: linear-gradient(to right, transparent, #000 10px, #000 calc(100% - 10px), transparent);
	}

	.tabs a,
	.contact a {
		display: block;
		padding: 6px 10px;
		border-radius: 6px;
		font-size: 0.9rem;
		white-space: nowrap;
		color: var(--text-muted);
		transition:
			color 0.2s,
			background 0.2s;
	}

	.tabs a:hover,
	.contact a:hover {
		color: var(--text);
		background: var(--bg-surface);
	}

	.tabs a[aria-current] {
		color: var(--text);
		background: var(--bg-surface);
		box-shadow: inset 0 -2px 0 var(--accent);
	}

	.contact {
		display: flex;
		gap: 2px;
		margin-left: auto;
		padding-left: 16px;
	}

	.contact a:hover {
		color: var(--accent);
	}

	@media (max-width: 900px) {
		.contact {
			display: none;
		}
	}
</style>
