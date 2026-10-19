<script lang="ts">
	import { chirp, chirpPath } from '../lib/chirp'
	import { fit } from '../lib/fit'
	import { site } from '../lib/site'
	import Arrow from './Arrow.svelte'
	import Signal from './Signal.svelte'

	interface Props {
		/** Show the masthead above the bar. Pages without it get just the bar. */
		intro?: boolean
	}

	let { intro = true }: Props = $props()

	let scrollY = $state(0)
	let innerHeight = $state(0)
	let pageHeight = $state(0)
	let introHeight = $state(0)
	let active = $state('')
	let tabs = $state<HTMLUListElement>()

	// 0 at the top of the page, 1 once the masthead has scrolled away and only the bar is left.
	const collapse = $derived(introHeight > 0 ? Math.min(Math.max(scrollY / introHeight, 0), 1) : 1)
	// How far through the page the reader is, shown by the trace along the bar.
	const progress = $derived(pageHeight > innerHeight ? Math.min(scrollY / (pageHeight - innerHeight), 1) : 0)

	const updated = new Date(__BUILD_DATE__).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
	const trace = chirpPath(chirp(500, -0.3, 0.02), 1000, 20)
	// The bar's background is cut along the same signal, so its bottom edge follows the trace.
	const traceEdge = `url("data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 20" preserveAspectRatio="none"><path d="${trace}L1000 0L0 0Z"/></svg>`,
	)}")`
	const contact = [...site.links, ...(site.resume ? [{ label: 'Résumé', href: site.resume }] : [])]

	const sectionId = (href: string) => href.split('#')[1] ?? ''
	// The last section may never reach the middle of the screen, so it counts as current at the very end.
	const current = $derived(progress > 0.995 ? sectionId(site.nav.at(-1)?.href ?? '') : active)
	const isExternal = (href: string) => /^https?:/.test(href)

	$effect(() => {
		const observer = new ResizeObserver(() => (pageHeight = document.documentElement.scrollHeight))
		observer.observe(document.body)
		return () => observer.disconnect()
	})

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
		const tab = current && tabs?.querySelector<HTMLElement>(`[href$="#${current}"]`)
		if (!tab || !tabs) return
		// Positions relative to the strip itself (offsetLeft would include the name before it).
		const strip = tabs.getBoundingClientRect()
		const box = tab.getBoundingClientRect()
		if (box.left < strip.left || box.right > strip.right) {
			tabs.scrollTo({ left: tabs.scrollLeft + box.left - strip.left - 16, behavior: 'smooth' })
		}
	})
</script>

<svelte:window bind:scrollY bind:innerHeight />

<!--
	The header is sticky with a negative top equal to the masthead's height, so it
	scrolls normally until only the bar is left on screen and then stays put.
	Its height never changes, so nothing below it shifts while it collapses.
-->
<header style:top="{-introHeight}px" style:--collapse={collapse} class:stuck={collapse >= 1}>
	{#if intro}
		<div class="masthead" bind:offsetHeight={introHeight}>
			<div class="wrap">
				<p class="folio annot">
					<span>Portfolio</span>
					<span>{site.location}</span>
					<span>Updated {updated}</span>
				</p>

				<h1 class="nameplate" {@attach fit({ min: 40, max: 200 })}><span>{site.name}</span></h1>

				<div class="deck grid">
					<p class="role annot">{site.role}</p>
					<p class="summary">{site.summary}</p>
					<ul class="contact">
						{#each contact as link (link.label)}
							<li>
								<a
									href={link.href}
									target={isExternal(link.href) ? '_blank' : undefined}
									rel={isExternal(link.href) ? 'noopener' : undefined}
								>
									{link.label}<Arrow />
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<Signal caption={site.figure.caption} />
			</div>
		</div>
	{/if}

	<nav aria-label="Main" data-print="hide" style:--trace-edge={traceEdge}>
		<div class="bar wrap">
			<a class="brand" href="/" tabindex={intro && collapse < 1 ? -1 : undefined}>{site.name}</a>
			<ul class="tabs" bind:this={tabs}>
				{#each site.nav as link, i (link.href)}
					<li>
						<a href={link.href} aria-current={current === sectionId(link.href) ? 'location' : undefined}>
							<span class="index">{String(i + 1).padStart(2, '0')}</span>{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<svg class="progress" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
			<path class="track" d={trace} />
			<path class="read" d={trace} style:clip-path="inset(0 {(1 - progress) * 100}% 0 0)" />
		</svg>
	</nav>
</header>

<style>
	header {
		/* The bar's name fades in over the last stretch of the collapse. */
		--brand: clamp(0, (var(--collapse) - 0.6) / 0.4, 1);

		position: sticky;
		z-index: 10;
	}

	.masthead .wrap {
		padding-top: var(--space-s);
		padding-bottom: var(--space-l);
		opacity: calc(1 - var(--collapse) * 1.25);
	}

	/* On load, the masthead is set line by line. */
	.masthead .wrap > :global(*) {
		animation: rise var(--dur-3) var(--ease-out) backwards;
	}

	.masthead .wrap > :global(:nth-child(2)) {
		animation-delay: 80ms;
	}

	.masthead .wrap > :global(:nth-child(3)) {
		animation-delay: 160ms;
	}

	.masthead .wrap > :global(:nth-child(4)) {
		animation-delay: 240ms;
	}

	@keyframes rise {
		from {
			opacity: 0;
			translate: 0 0.5rem;
		}
	}

	.folio {
		display: flex;
		justify-content: space-between;
		gap: var(--space-s);
		padding-bottom: var(--space-2xs);
		border-bottom: 1px solid var(--rule-strong);
	}

	/* fit() trims the name's box to its letters, so equal margins give equal
	   space between the letters and the rules above and below. */
	.nameplate {
		margin-block: var(--space-m);
		font-weight: 450;
		letter-spacing: -0.035em;
		white-space: nowrap;
	}

	.nameplate span {
		display: block;
		width: max-content;
		line-height: 1;
	}

	.deck {
		row-gap: var(--space-s);
		padding-top: var(--space-s);
		margin-bottom: var(--space-l);
		border-top: 3px double var(--rule-strong);
	}

	.role {
		grid-column: margin;
		padding-top: 0.45em;
		color: var(--spot);
	}

	.summary {
		grid-column: 4 / 10;
		font-size: var(--step-2);
		line-height: 1.3;
		letter-spacing: -0.005em;
	}

	.contact {
		grid-column: 10 / -1;
		padding-top: 0.3em;
	}

	.contact li + li {
		border-top: 1px solid var(--rule);
	}

	.contact a {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-block: 0.3em;
		transition: color var(--dur-2);
	}

	.contact a:hover {
		color: var(--spot);
	}

	nav {
		position: relative;
		isolation: isolate;
		height: var(--bar-h);
	}

	/* The bar's background reaches down to the middle of the progress trace and
	   is masked along the signal, so the edge between bar and page is the trace. */
	nav::before {
		content: '';
		position: absolute;
		inset: 0 0 -5px;
		z-index: -1;
		background: var(--paper);
		mask:
			linear-gradient(#000 0 0) top / 100% calc(100% - 9px) no-repeat,
			var(--trace-edge) bottom / 100% 10px no-repeat;
		transition: background var(--dur-2);
	}

	.stuck nav::before {
		background: color-mix(in oklch, var(--paper) 86%, transparent);
		backdrop-filter: blur(12px) saturate(1.3);
	}

	.bar {
		height: 100%;
		display: flex;
		align-items: center;
	}

	.brand {
		flex-shrink: 0;
		max-width: calc(var(--brand) * 16rem);
		margin-right: calc(var(--brand) * var(--space-l));
		overflow: hidden;
		white-space: nowrap;
		font-size: var(--step-1);
		font-weight: 500;
		letter-spacing: -0.015em;
		opacity: var(--brand);
	}

	.tabs {
		display: flex;
		gap: var(--space-m);
		min-width: 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.tabs a {
		display: flex;
		align-items: baseline;
		gap: 0.5em;
		padding-block: 0.4em;
		font-family: var(--font-mono);
		font-size: var(--step--2);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--ink-3);
		transition: color var(--dur-2);
	}

	.index {
		color: var(--rule-strong);
		transition: color var(--dur-2);
	}

	.tabs a:hover,
	.tabs a[aria-current] {
		color: var(--ink);
	}

	.tabs a[aria-current] .index {
		color: var(--spot);
	}

	/* Reading progress, drawn as the same signal along the bottom of the bar. */
	.progress {
		position: absolute;
		inset-inline: 0;
		bottom: -5px;
		width: 100%;
		height: 10px;
		overflow: visible;
		pointer-events: none;
	}

	.progress path {
		fill: none;
		stroke-width: 1;
		vector-effect: non-scaling-stroke;
	}

	.track {
		stroke: var(--rule-strong);
	}

	.read {
		stroke: var(--spot);
		stroke-width: 1.5;
	}

	@media print {
		.nameplate span {
			font-size: 4.5rem !important;
			margin: 0 !important;
		}

		.masthead .wrap {
			opacity: 1;
		}
	}

	@media (max-width: 900px) {
		.summary,
		.contact {
			grid-column: 1 / -1;
		}

		.contact {
			display: flex;
			flex-wrap: wrap;
			gap: 0 var(--space-m);
		}

		.contact li + li {
			border-top: none;
		}

		.folio span:nth-child(2) {
			display: none;
		}
	}
</style>
