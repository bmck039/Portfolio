export interface Link {
	label: string
	href: string
}

/** Site-wide details used by the header and footer. */
export const site = {
	/** Shown on one line at the top of the home page, and in the bar once it collapses. */
	name: 'Ben McKallip',
	role: 'Physicist | Computer Scientist',
	summary:
		'As both a computer scientist and physicist by training, I approach problems with a unique blend of attention to detail, analytical rigor, and computational skill.',
	/** Shown in the line above the name. */
	location: 'Round Rock, TX',

	/** The signal figure at the top of the home page. */
	figure: {
		caption:
			'The gravitational-wave “chirp” of two black holes spiralling together. The signal rises in frequency and strength until, at zero, they merge into one.',
	},

	/** Section links in the header bar, numbered in order. Each `#id` matches the `id` of a <Section>. */
	nav: [
		{ label: 'About', href: '/#about' },
		{ label: 'Projects', href: '/#projects' },
		{ label: 'Experience', href: '/#experience' },
		{ label: 'Skills', href: '/#skills' },
		{ label: 'Education', href: '/#education' },
		{ label: 'Contact', href: '/#contact' },
	] satisfies Link[],

	/** Contact links: listed in the masthead, the contact section and the footer. */
	links: [
		{ label: 'Email', href: 'mailto:bmckallip02@gmail.com' },
		{ label: 'GitHub', href: 'https://github.com/bmck039' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/ben-mckallip' },
	] satisfies Link[],

	/** Adds a Résumé link to the masthead, e.g. '/resume.pdf'. */
	resume: null as string | null,

	/** Closing note in the footer about how the site is made. */
	colophon:
		'Set in Newsreader and Geist Mono. Built with Svelte and Go, and served from a Docker container using Cloudflare.',
}
