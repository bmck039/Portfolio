<script lang="ts">
	import { site } from '../lib/site'

	const year = new Date().getFullYear()
</script>

<footer>
	<div class="inner">
		<p>© {year} {site.name.first} {site.name.last}</p>
		<ul>
			{#each site.links as link (link.label)}
				<li><a href={link.href} target="_blank" rel="noopener">{link.label}</a></li>
			{/each}
		</ul>
	</div>
</footer>

<style>
	footer {
		position: relative;
		z-index: 1;
		padding: 28px 0;
		border-top: 1px solid var(--border);
		background: var(--bg);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--text-muted);
	}

	.inner {
		max-width: var(--max-w);
		margin: 0 auto;
		padding: 0 var(--gutter);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}

	ul {
		display: flex;
		gap: 24px;
	}

	a {
		transition: color 0.2s;
	}

	a:hover {
		color: var(--text);
	}

	@media (max-width: 680px) {
		.inner {
			flex-direction: column;
			text-align: center;
		}
	}
</style>
