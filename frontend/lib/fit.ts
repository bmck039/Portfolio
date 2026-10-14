import type { Attachment } from 'svelte/attachments'

/**
 * Sets an element's first child on one line so its letters exactly span the
 * element's width, like a magazine nameplate: `{@attach fit({ max: 180 })}`.
 *
 * The child's box is also trimmed to the letters themselves (from the top of
 * the tallest ascender to the bottom of the deepest descender, and from the
 * first stroke to the last), so margins around it measure from the ink.
 * The child needs `display: block` and `line-height: 1`.
 */
export function fit({ min = 32, max = 220 }: { min?: number; max?: number } = {}): Attachment<HTMLElement> {
	return (node) => {
		const text = node.firstElementChild as HTMLElement | null
		const context = document.createElement('canvas').getContext('2d')
		if (!text || !context) return

		const measure = (size: number) => {
			const style = getComputedStyle(text)
			context.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`
			return context.measureText(text.textContent ?? '')
		}

		const update = () => {
			// Measure twice: the font's optical size changes its shapes slightly with size.
			let size = 100
			for (let pass = 0; pass < 2; pass++) {
				const ink = measure(size)
				const width = ink.actualBoundingBoxLeft + ink.actualBoundingBoxRight
				size = Math.min(max, Math.max(min, (size * node.clientWidth) / width))
			}

			const ink = measure(size)
			const halfLeading = (size - ink.fontBoundingBoxAscent - ink.fontBoundingBoxDescent) / 2
			text.style.fontSize = `${size}px`
			text.style.marginTop = `${-(halfLeading + ink.fontBoundingBoxAscent - ink.actualBoundingBoxAscent)}px`
			text.style.marginBottom = `${-(halfLeading + ink.fontBoundingBoxDescent - ink.actualBoundingBoxDescent)}px`
			text.style.marginLeft = `${ink.actualBoundingBoxLeft}px`
		}

		const observer = new ResizeObserver(update)
		observer.observe(node)
		// Re-measure once the web font replaces the fallback.
		document.fonts.ready.then(update)
		return () => observer.disconnect()
	}
}
