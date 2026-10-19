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
	<Section label="About" title="Programmer and Physicist">
		<Note>B.S. Physics and Computer Science, minor in Mathematics. Southwestern University, 2026.</Note>
		<p>
			I studied physics and computer science at Southwestern University, with a minor in mathematics, and
			graduated in May 2026. I enjoy working on both the analytical and computational sides of problems. I also enjoy creating software that solves complex challenges.
		</p>
		<p>
			In the summer of 2025 I joined an NSF Research Experience for Undergraduates at UT Dallas, studying
			gravitational waves from merging black holes. That work led to a fix in PyCBC, a gravitational-wave library
			used by researchers internationally, and to a co-authored paper now under review at Physical Review D.
		</p>
		<p>
			On the software side, I built the backend of a platform that matches 1,600 students with 70 campus
			organizations, spent more than two years as an IT student technician keeping the university's equipment running, and created an AI framework for incomplete-information games.
		</p>
	</Section>

	<Section label="Projects" title="Selected work">
		<Card
			width="full"
			badge="Jan – May 2026"
			title="Campus Organization Matching"
			subtitle="Full-stack capstone · Southwestern University"
			desc="A platform that matches 1,600 students with 70 campus organizations. I wrote the Go web server, the PostgreSQL schema, Google sign-in and the REST API; set up production hosting through a Cloudflare Tunnel on a self-hosted server; provisioned a shared Linux VM for the team; and supported three teammates on the Svelte frontend. Presented to the Office of Student Life, with official adoption pending."
			tags={['Go', 'Svelte', 'PostgreSQL', 'Google Cloud', 'Cloudflare', 'Linux']}
			link="github.com/MattVolkin/SU-Organization-Matching"
		/>
		<Card
			width="half"
			img="/img/spades-winrates.png"
			alt="Box plots of score differentials for three pairings of Spades agents"
			caption="Score differentials between agent pairings across simulated tournaments."
			badge="Jan – May 2024"
			title="Multi-Agent Spades AI"
			subtitle="Artificial Intelligence course · Southwestern University"
			desc="A game framework for the card game Spades, with agents that reason under imperfect information and coordinate with a partner they can't see into. Built with three other students using Monte Carlo Tree Search and deep reinforcement learning trained through self-play, reaching intermediate human-level play."
			tags={['Python', 'PyTorch', 'Docker', 'Reinforcement learning']}
			link="github.com/bmck039/AI-Agents-in-Spades"
		/>
		<Card
			width="half"
			img="/img/optimized_match-bugfix.png"
			alt="Plot of match values against time shift showing a sharp unphysical spike"
			caption="Unphysical spike in match values due to unbounded optimization."
			badge="May – Aug 2025"
			title="Fixing optimized_match() in PyCBC"
			subtitle="Open-source contribution · gwastro/pycbc PR #5146"
			desc="I found unphysical, discontinuous output from PyCBC's optimized_match() and traced it to an unbounded scipy.optimize.minimize_scalar call escaping the valid parameter range. The fix switches to a bounded call and adds the edge case to the test suite; core maintainers have approved it pending a minor refactor."
			tags={['Python', 'SciPy', 'Matched filtering', 'pytest']}
			link="github.com/gwastro/pycbc/pull/5146"
		/>
		<Card
			width="half"
			img="/img/precessing-bbh-diagram.jpg"
			alt="Diagram of a precessing binary black hole system and its waveform"
			caption="Diagram of a binary black hole system and its waveform."
			badge="May – Aug 2025"
			title="Lensing and Precession"
			subtitle="NSF REU · UT Dallas"
			desc="Code to generate inspiral waveforms from binary black holes with gravitational lensing and orbital precession, and to compare them with matched filtering to find where the two effects can be confused. Co-author of the resulting paper, “Distinguishing lensing and precessional modulation in binary black-hole inspiral waveforms,” under review at Physical Review D."
			tags={['Python', 'Jupyter', 'PyCBC', 'Matched filtering']}
			link="github.com/bmck039/lensing_and_precession"
		/>
		<Card
			width="half"
			img="/img/kcf.jpg"
			alt="A small four-legged robot built from white 3D-printed parts and servo motors"
			caption="Custom-built quadruped robot prototype with twelve servo-driven joints."
			badge="Jan – May 2025"
			title="Quadruped Robot"
			subtitle="Robotics research · Southwestern University"
			desc="An Arduino C++ library for a custom-built quadruped robot with twelve servo-driven joints: inverse kinematics, smooth time-parameterised movement across all joints, and interactive calibration. Built with Collin Cook."
			tags={['C++', 'Arduino', 'Inverse kinematics']}
			link="github.com/bmck039/Robot_King_Creativity"
		/>
		<Card
			width="full"
			badge="Jan – May 2024"
			title="Fish Tank Controller"
			subtitle="Home automation · Personal project"
			desc="An automated aquarium system: a web dashboard for logging water readings, a TensorFlow model that predicts future tank conditions and fertilization routine from them, and Bluetooth control of the tank's light using a protocol reverse-engineered from the manufacturer's Android app."
			tags={['Python', 'TensorFlow', 'Bluetooth LE']}
			link="github.com/bmck039/Fish-Tank-Controller"
		/>
		<Card
			width="full"
			badge="Oct 2026"
			title="This Portfolio"
			subtitle="Personal project · benmckallip.com"
			desc="The site you're reading: a Go web server and a Svelte and TypeScript frontend, packaged in Docker and served through a Cloudflare Tunnel. Its editorial design system follows each visitor's light or dark setting, project cards fill themselves in from GitHub, and Fig. 1 is an interactive model of a gravitational-wave chirp."
			tags={['Go', 'Svelte', 'TypeScript', 'Docker', 'Cloudflare']}
			link="github.com/bmck039/Portfolio"
		/>
	</Section>

	<Section label="Publications" title="Research papers">
		<Card
			width="full"
			badge="Sep 2026"
			title="Distinguishing lensing and precessional modulation in binary black-hole inspiral waveforms"
			subtitle="Tien N. Nguyen-Vo, Tamanjyot Singh, Benjamin McKallip, Michael Kesden and Lindsay King"
			desc="Gravitational lensing and spin precession can both modulate the gravitational waves from inspiralling binary black holes. We test whether a single L-shaped detector can tell them apart, and find that precession can mimic lensing between two similarly magnified images when fewer than three interference fringes fall within the detector's sensitive band. Because misaligned spins are common and strong lensing is rare, ruling out precession is essential to identifying genuinely lensed systems."
			tags={['Under review at Physical Review D', 'arXiv:2609.06347', 'gr-qc']}
			link="https://arxiv.org/abs/2609.06347"
		/>
	</Section>

	<Section label="Experience" title="Research and work">
		<Card
			width="full"
			badge="Apr 2024 – Aug 2026"
			title="IT Student Technician"
			subtitle="Southwestern University · Georgetown, TX"
			desc="Hardware and software support across campus, explaining fixes along the way, and upkeep of workstations, printers and network equipment. I automated software installation and setup for campus computers, handled imaging and equipment lifecycle, and led training presentations and hands-on exercises for new technicians."
		/>
		<Card
			width="full"
			badge="May – Aug 2025"
			title="NSF Research Experience for Undergraduates"
			subtitle="UT Dallas · with Dr. Michael Kesden"
			desc="Research on telling apart gravitational lensing and orbital precession in binary black-hole waveforms, using PyCBC and matched filtering. Led to the PyCBC fix and the co-authored Physical Review D submission above."
		/>
	</Section>

	<Section label="Skills" title="Tools I work with">
		<Skills groups={skills} />
	</Section>

	<Section label="Education" title="Where I studied">
		<Card
			width="full"
			badge="May 2026"
			title="Southwestern University"
			subtitle="B.S. Physics and Computer Science, minor in Mathematics"
			desc="Coursework included Artificial Intelligence, Database Management and the Senior Seminar in Software Engineering."
			tags={['Georgetown, TX']}
		/>
	</Section>

	<Section label="Contact" title="Get in touch">
		<p>Email is the best way to reach me. I'm also on GitHub and LinkedIn.</p>
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
		gap: var(--space-2xs) var(--space-l);
	}
</style>
