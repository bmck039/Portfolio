import type { Attachment } from 'svelte/attachments'

/**
 * Sizes an element's first child so it exactly fills the element's width on one
 * line, like a magazine nameplate: `{@attach fit({ max: 180 })}`.
 */
export function fit({ min = 32, max = 220 }: { min?: number; max?: number } = {}): Attachment<HTMLElement> {
	return (node) => {
		const text = node.firstElementChild as HTMLElement | null
		if (!text) return

		const update = () => {
			text.style.fontSize = '100px'
			// A hair under the full width, so overhanging letters stay inside the margin.
			const size = (98.5 * node.clientWidth) / text.getBoundingClientRect().width
			text.style.fontSize = `${Math.min(max, Math.max(min, size))}px`
		}

		const observer = new ResizeObserver(update)
		observer.observe(node)
		// Re-measure once the web font replaces the fallback.
		document.fonts.ready.then(update)
		return () => observer.disconnect()
	}
}
