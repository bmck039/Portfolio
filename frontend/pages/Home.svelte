<script lang="ts">
	import Button from '../components/Button.svelte'
	import Card from '../components/Card.svelte'
	import Layout from '../components/Layout.svelte'
	import Note from '../components/Note.svelte'
	import Section from '../components/Section.svelte'
	import Skills from '../components/Skills.svelte'
	import { site } from '../lib/site'
	import { skills } from '../lib/skills'
</script>

<Layout>
	<Section label="About" title="Section heading">
		<Note>A margin note sits beside the paragraph that follows it.</Note>
		<p>First paragraph.</p>
		<p>Second paragraph.</p>
	</Section>

	<Section label="Skills" title="Section heading">
		<Skills groups={skills} />
	</Section>

	<Section label="Projects" title="Section heading">
		<!-- Title, description and tags come from GitHub when only a repository link is given. -->
		<Card link="github.com/bmck039/AI-Agents-in-Spades" img="/img/spades-winrates.png" width="full" />
		<Card
			link="github.com/bmck039/lensing_and_precession"
			img="/img/precessing-bbh-diagram.jpg"
			width="half"
		/>
		<Card link="github.com/bmck039/Robot_King_Creativity" img="/img/kcf.jpg" width="half" />
		<Card link="github.com/bmck039/pycbc" img="/img/optimized_match-bugfix.png" width="half" />
		<Card
			width="half"
			title="Project title"
			subtitle="Subtitle"
			desc="Project description."
			badge="Category"
			tags={['Tag', 'Another tag']}
			link="https://example.com"
		/>
	</Section>

	<Section label="Education" title="Section heading">
		<Card
			width="full"
			badge="Dates"
			title="Institution"
			subtitle="Degree"
			desc="Details."
			tags={['Highlight', 'Another highlight']}
		/>
	</Section>

	<Section label="Contact" title="Section heading">
		<p>A short message.</p>
		<div class="actions">
			{#each site.links as link, i (link.label)}
				<Button href={link.href} variant={i === 0 ? 'primary' : 'secondary'}>{link.label}</Button>
			{/each}
		</div>
	</Section>
</Layout>

<style>
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) var(--space-l);
	}
</style>
