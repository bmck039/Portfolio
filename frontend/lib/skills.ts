import {
	siC,
	siCloudflare,
	siCplusplus,
	siCss,
	siDocker,
	siGithubactions,
	siGnubash,
	siGo,
	siGooglecloud,
	siHtml5,
	siJavascript,
	siLinux,
	siMongodb,
	siNeo4j,
	siNodedotjs,
	siNumpy,
	siOpenjdk,
	siPostgresql,
	siPython,
	siPytorch,
	siScikitlearn,
	siScipy,
	siSvelte,
	siTensorflow,
	siTypescript,
	type SimpleIcon,
} from 'simple-icons'

/**
 * A skill is just its name, or `{ name, icon }` to show a logo next to it.
 * Logos come from simple-icons: find the slug at https://simpleicons.org,
 * then import it above as `si` + slug, e.g. `siPython` for "python".
 */
export type Skill = string | { name: string; icon?: SimpleIcon }

export interface SkillGroup {
	name: string
	skills: Skill[]
}

/** Shown by <Skills> in the order written here. Add, remove or reorder freely. */
export const skills: SkillGroup[] = [
	{
		name: 'Languages',
		skills: [
			{ name: 'Python', icon: siPython },
			{ name: 'TypeScript', icon: siTypescript },
			{ name: 'JavaScript', icon: siJavascript },
			{ name: 'Go', icon: siGo },
			{ name: 'C', icon: siC },
			{ name: 'C++', icon: siCplusplus },
			{ name: 'Java', icon: siOpenjdk },
			{ name: 'HTML', icon: siHtml5 },
			{ name: 'CSS', icon: siCss },
		],
	},
	{
		name: 'Databases',
		skills: [
			{ name: 'PostgreSQL', icon: siPostgresql },
			{ name: 'MongoDB', icon: siMongodb },
			{ name: 'Neo4j', icon: siNeo4j },
			'SQL',
			'Schema design',
			'ORM',
		],
	},
	{
		name: 'AI & machine learning',
		skills: [
			{ name: 'PyTorch', icon: siPytorch },
			{ name: 'TensorFlow', icon: siTensorflow },
			{ name: 'NumPy', icon: siNumpy },
			{ name: 'SciPy', icon: siScipy },
			{ name: 'scikit-learn', icon: siScikitlearn },
			'Reinforcement learning',
			'LLM APIs',
		],
	},
	{
		name: 'Web & backend',
		skills: [
			{ name: 'Svelte / SvelteKit', icon: siSvelte },
			{ name: 'Node.js', icon: siNodedotjs },
			'Gorilla Mux',
			'REST API design',
			'WebSockets',
			'OAuth',
			{ name: 'Cloudflare', icon: siCloudflare },
		],
	},
	{
		name: 'Cloud & DevOps',
		skills: [
			{ name: 'Docker', icon: siDocker },
			{ name: 'Google Cloud', icon: siGooglecloud },
			{ name: 'GitHub Actions', icon: siGithubactions },
			'CI/CD',
			{ name: 'Linux server admin', icon: siLinux },
			{ name: 'Bash', icon: siGnubash },
		],
	},
]
