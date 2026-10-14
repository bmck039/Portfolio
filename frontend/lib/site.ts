export interface Link {
	label: string
	href: string
}

/** Site-wide details shared by the navigation bar and footer. */
export const site = {
	name: { first: 'First', last: 'Last' },

	/** Navigation links. Each `#id` matches the `id` of a <Section> on the home page. */
	nav: [
		{ label: 'About', href: '/#about' },
		{ label: 'Skills', href: '/#skills' },
		{ label: 'Projects', href: '/#projects' },
		{ label: 'Education', href: '/#education' },
		{ label: 'Contact', href: '/#contact' },
	] satisfies Link[],

	/** Shown in the footer. */
	links: [
		{ label: 'Link one', href: '#' },
		{ label: 'Link two', href: '#' },
	] satisfies Link[],

	/** Adds a highlighted button to the navigation bar, e.g. '/resume.pdf'. */
	resume: null as string | null,
}
