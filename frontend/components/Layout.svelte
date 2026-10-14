<script lang="ts">
	import '@fontsource-variable/geist-mono'
	import '@fontsource-variable/newsreader/opsz.css'
	import type { Snippet } from 'svelte'
	import '../lib/styles/tokens.css'
	import '../lib/styles/base.css'
	import '../lib/styles/print.css'
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'

	interface Props {
		/** Show the name and summary above the header bar. */
		intro?: boolean
		children: Snippet
	}

	let { intro = true, children }: Props = $props()
</script>

<a class="skip" href="#content" data-print="hide">Skip to content</a>
<Header {intro} />
<main id="content">
	{@render children()}
</main>
<Footer />

<style>
	.skip {
		position: fixed;
		top: 8px;
		left: 8px;
		z-index: 20;
		padding: 8px 14px;
		border-radius: 8px;
		background: var(--spot);
		color: var(--paper);
		translate: 0 -200%;
	}

	.skip:focus-visible {
		translate: 0;
	}
</style>
