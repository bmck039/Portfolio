<script lang="ts">
	import type { SkillGroup } from '../lib/skills'
	import { reveal } from '../lib/reveal'

	let { groups }: { groups: SkillGroup[] } = $props()
</script>

<div class="skills">
	{#each groups as group, i (i)}
		<div class="group" {@attach reveal}>
			<h3>
				{group.name}
				<span class="annot count">{String(group.skills.length).padStart(2, '0')}</span>
			</h3>
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
	.skills,
	.group {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
	}

	.group {
		row-gap: var(--space-xs);
		padding-block: var(--space-s);
		border-top: 1px solid var(--rule);
	}

	.group:first-child {
		border-top: none;
		padding-top: 0;
	}

	h3 {
		grid-column: margin;
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-xs);
		font-size: var(--step-1);
		font-weight: 450;
	}

	.count {
		color: var(--spot);
	}

	ul {
		grid-column: body;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs);
	}

	li {
		display: inline-flex;
		align-items: center;
		gap: 0.45em;
		padding: 0.3em 0.75em 0.35em;
		border: 1px solid var(--rule-strong);
		border-radius: 2px;
		font-size: var(--step--1);
		line-height: 1.3;
		transition:
			border-color var(--dur-2),
			background var(--dur-2),
			color var(--dur-2);
	}

	li:hover {
		border-color: var(--spot);
		background: var(--spot-wash);
	}

	svg {
		width: 0.95em;
		height: 0.95em;
		fill: var(--ink-2);
		transition: fill var(--dur-2);
	}

	li:hover svg {
		fill: var(--spot);
	}

	@media (max-width: 900px) {
		h3 {
			justify-content: start;
		}
	}
</style>
