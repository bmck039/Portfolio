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
	/** Shown in the line above the name. */
	location: 'City, State',

	/** The signal figure at the top of the home page. */
	figure: {
		caption:
			'The gravitational-wave “chirp” of two black holes spiralling together. The signal rises in pitch and strength until, at zero, they merge into one.',
	},

	/** Section links in the header bar, numbered in order. Each `#id` matches the `id` of a <Section>. */
	nav: [
		{ label: 'About', href: '/#about' },
		{ label: 'Skills', href: '/#skills' },
		{ label: 'Projects', href: '/#projects' },
		{ label: 'Education', href: '/#education' },
		{ label: 'Contact', href: '/#contact' },
	] satisfies Link[],

	/** Contact links: listed in the masthead, the contact section and the footer. */
	links: [
		{ label: 'Email', href: 'mailto:you@example.com' },
		{ label: 'GitHub', href: 'https://github.com/' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/' },
	] satisfies Link[],

	/** Adds a Résumé link to the masthead, e.g. '/resume.pdf'. */
	resume: null as string | null,

	/** Closing note in the footer about how the site is made. */
	colophon:
		'Set in Newsreader and Geist Mono. Built with Svelte and Go, and served from a Docker container through a Cloudflare tunnel.',
}
