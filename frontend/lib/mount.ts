import { mount, type Component } from 'svelte'

/** Renders a page component into the #app element of its .html file. */
export function mountPage(Page: Component) {
	return mount(Page, { target: document.getElementById('app')! })
}
