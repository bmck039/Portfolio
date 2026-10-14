import { siDocker, siGo, siSvelte, type SimpleIcon } from 'simple-icons'

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
		name: 'Category',
		skills: [{ name: 'Go', icon: siGo }, { name: 'Svelte', icon: siSvelte }, { name: 'Docker', icon: siDocker }],
	},
	{
		name: 'Category',
		skills: ['Skill', 'Skill', 'Skill', 'Skill', 'Skill'],
	},
	{
		name: 'Category',
		skills: ['Skill', 'Skill', 'Skill'],
	},
]
