import type { Attachment } from 'svelte/attachments'

let observer: IntersectionObserver | undefined

/**
 * Fades an element in the first time it scrolls into view: `{@attach reveal}`.
 * The styles live in app.css under [data-reveal].
 */
export const reveal: Attachment<HTMLElement> = (node) => {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue
				;(entry.target as HTMLElement).dataset.reveal = 'visible'
				observer?.unobserve(entry.target)
			}
		},
		{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
	)

	node.dataset.reveal = 'hidden'
	observer.observe(node)
	return () => observer?.unobserve(node)
}
