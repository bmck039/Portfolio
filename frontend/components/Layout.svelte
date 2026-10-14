<script lang="ts">
	import type { Snippet } from 'svelte'
	import '../lib/app.css'
	import Footer from './Footer.svelte'
	import Nav from './Nav.svelte'

	let { children }: { children: Snippet } = $props()
</script>

<Nav />
<main>
	{@render children()}
</main>
<Footer />
