<script lang="ts">
	import Button from '../components/Button.svelte'
	import Card from '../components/Card.svelte'
	import Hero from '../components/Hero.svelte'
	import Layout from '../components/Layout.svelte'
	import Section from '../components/Section.svelte'
	import { site } from '../lib/site'
</script>

<Layout>
	<Hero
		eyebrow="Tagline · Tagline"
		title={site.name.first}
		subtitle={site.name.last}
		desc="A sentence or two introducing yourself."
	>
		<Button href="#projects" variant="primary">Primary action ↓</Button>
		<Button href="#contact">Secondary action</Button>
	</Hero>

	<Section label="About" title="Section heading">
		<p>First paragraph.</p>
		<p>Second paragraph.</p>
	</Section>

	<Section label="Skills" title="Section heading">
		<Card title="Skill group" tags={['Skill', 'Another skill', 'A third skill']} />
		<Card title="Skill group" tags={['Skill', 'Another skill']} />
		<Card title="Skill group" tags={['Skill', 'Another skill', 'A third skill', 'A fourth skill']} />
	</Section>

	<Section label="Projects" title="Section heading">
		<!-- Title, description and tags come from GitHub when only a repository link is given. -->
		<Card link="github.com/bmck039/AI-Agents-in-Spades" img="/img/spades-winrates.png" width="half" accent="teal" />
		<Card
			link="github.com/bmck039/lensing_and_precession"
			img="/img/precessing-bbh-diagram.jpg"
			width="half"
			accent="violet"
		/>
		<Card link="github.com/bmck039/Robot_King_Creativity" img="/img/kcf.jpg" accent="green" />
		<Card link="github.com/bmck039/pycbc" img="/img/optimized_match-bugfix.png" accent="violet" />
		<Card
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
			{#each site.links as link (link.label)}
				<Button href={link.href}>{link.label}</Button>
			{/each}
		</div>
	</Section>
</Layout>

<style>
	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 16px;
	}
</style>
