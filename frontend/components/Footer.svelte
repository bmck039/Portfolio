<script lang="ts">
	import { site } from '../lib/site'
	import Arrow from './Arrow.svelte'

	const year = new Date().getFullYear()
	const updated = new Date(__BUILD_DATE__).toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
	const isExternal = (href: string) => /^https?:/.test(href)
</script>

<footer>
	<div class="wrap grid">
		<div class="rule" aria-hidden="true"></div>

		<p class="annot label">Colophon</p>

		<div class="colophon">
			<p>{site.colophon}<span class="end" aria-hidden="true"></span></p>
			<p class="annot">© {year} {site.name} · Last updated {updated}</p>
		</div>

		<ul class="links">
			{#each site.links as link (link.label)}
				<li>
					<a
						href={link.href}
						target={isExternal(link.href) ? '_blank' : undefined}
						rel={isExternal(link.href) ? 'noopener' : undefined}>{link.label}<Arrow /></a
					>
				</li>
			{/each}
			<!-- With no element called "top" on the page, #top means the top of the document. -->
			<li data-print="hide"><a href="#top">Back to top<Arrow direction="up" /></a></li>
		</ul>
	</div>
</footer>

<style>
	footer {
		padding-block: 0 var(--space-xl);
	}

	.rule {
		grid-column: 1 / -1;
		margin-bottom: var(--space-s);
		border-top: 3px double var(--rule-strong);
	}

	.label {
		grid-column: margin;
		padding-top: 0.3em;
	}

	.colophon {
		grid-column: 4 / 10;
		display: grid;
		gap: var(--space-xs);
		font-size: var(--step--1);
		color: var(--ink-2);
	}

	.colophon p:first-child {
		max-width: 52ch;
	}

	/* End mark, as at the close of a magazine article. */
	.end {
		display: inline-block;
		width: 0.55em;
		height: 0.55em;
		margin-left: 0.4em;
		background: var(--spot);
	}

	.links {
		grid-column: 10 / -1;
		font-size: var(--step--1);
	}

	.links li + li {
		border-top: 1px solid var(--rule);
	}

	.links a {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding-block: 0.25em;
		transition: color var(--dur-2);
	}

	.links a:hover {
		color: var(--spot);
	}

	@media (max-width: 900px) {
		.colophon,
		.links {
			grid-column: 1 / -1;
		}

		.colophon {
			margin-block: var(--space-xs) var(--space-m);
		}
	}
</style>
