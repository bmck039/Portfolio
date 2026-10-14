export interface Link {
	label: string
	href: string
}

/** Site-wide details used by the header and footer. */
export const site = {
	/** Shown on one line at the top of the home page, and in the bar once it collapses. */
	name: 'Your Name',
	role: 'Your role',
	summary: 'One or two sentences about what you do.',

	/** Section links in the header bar. Each `#id` matches the `id` of a <Section>. */
	nav: [
		{ label: 'About', href: '/#about' },
		{ label: 'Skills', href: '/#skills' },
		{ label: 'Projects', href: '/#projects' },
		{ label: 'Education', href: '/#education' },
		{ label: 'Contact', href: '/#contact' },
	] satisfies Link[],

	/** Contact links: buttons in the intro, links in the header bar and footer. */
	links: [
		{ label: 'Email', href: 'mailto:you@example.com' },
		{ label: 'GitHub', href: 'https://github.com/' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/' },
	] satisfies Link[],

	/** Adds a Résumé button to the intro, e.g. '/resume.pdf'. */
	resume: null as string | null,
}
