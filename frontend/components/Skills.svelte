<script lang="ts">
	import type { SkillGroup } from '../lib/skills'
	import { reveal } from '../lib/reveal'

	let { groups }: { groups: SkillGroup[] } = $props()
</script>

<div class="skills">
	{#each groups as group, i (i)}
		<div class="group" {@attach reveal}>
			<h3>{group.name}</h3>
			<ul>
				{#each group.skills as skill, j (j)}
					{@const { name, icon } = typeof skill === 'string' ? { name: skill, icon: undefined } : skill}
					<li>
						{#if icon}
							<svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg>
						{/if}
						{name}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<style>
	.group {
		display: grid;
		grid-template-columns: 11rem 1fr;
		gap: 12px 24px;
		align-items: start;
		padding-block: 20px;
		border-top: 1px solid var(--border);
	}

	.group:first-child {
		border-top: none;
		padding-top: 0;
	}

	h3 {
		padding-top: 7px;
		font-size: 0.95rem;
		font-weight: 600;
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	li {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--bg-raised);
		font-size: 0.9rem;
		transition:
			border-color 0.2s,
			color 0.2s;
	}

	li:hover {
		border-color: color-mix(in oklch, var(--accent) 50%, var(--border));
	}

	svg {
		width: 1em;
		height: 1em;
		fill: var(--text-muted);
		transition: fill 0.2s;
	}

	li:hover svg {
		fill: var(--accent);
	}

	@media (max-width: 640px) {
		.group {
			grid-template-columns: 1fr;
		}

		h3 {
			padding-top: 0;
		}
	}
</style>
