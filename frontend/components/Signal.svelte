<script lang="ts">
	import { chirp, chirpPath } from '../lib/chirp'

	/** Figure caption, shown after the figure number. */
	let { caption }: { caption: string } = $props()

	const W = 1000
	const H = 200
	const signal = chirp()
	const path = chirpPath(signal, W, H)
	const last = signal.t.length - 1
	const start = signal.t[0]
	const end = signal.t[last]

	/** Horizontal position of a time, as a percentage of the plot width. */
	const x = (t: number) => ((t - start) / (end - start)) * 100

	const ticks: number[] = []
	for (let t = Math.ceil(start / 0.05) * 0.05; t <= end + 1e-9; t += 0.05) ticks.push(Math.round(t * 100) / 100)

	// Index of the sample under the pointer (or keyboard cursor), or null when idle.
	let index = $state<number | null>(null)

	const cursor = $derived(
		index === null
			? null
			: { x: (index / last) * 100, y: 50 - signal.h[index] * 46, t: signal.t[index], f: signal.f[index] },
	)

	const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
	const formatTime = (t: number) => `${t < -0.0005 ? '−' : '+'}${Math.abs(t).toFixed(3)} s`
	const formatFreq = (f: number) => `${Math.round(f)} Hz`

	function point(event: PointerEvent) {
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect()
		index = Math.round(clamp((event.clientX - box.left) / box.width, 0, 1) * last)
	}

	function onkeydown(event: KeyboardEvent) {
		const step = Math.round(last / 100) * (event.shiftKey ? 10 : 1)
		const current = index ?? Math.round(last * 0.85)
		const next: Record<string, number> = {
			ArrowRight: current + step,
			ArrowUp: current + step,
			ArrowLeft: current - step,
			ArrowDown: current - step,
			Home: 0,
			End: last,
		}
		if (!(event.key in next)) return
		event.preventDefault()
		index = clamp(next[event.key], 0, last)
	}
</script>

<figure class="signal">
	<div
		class="plot"
		role="slider"
		tabindex="0"
		aria-label="Time along the signal"
		aria-valuemin={0}
		aria-valuemax={last}
		aria-valuenow={index ?? last}
		aria-valuetext={cursor
			? `${formatTime(cursor.t)}, ${formatFreq(cursor.f)}`
			: 'Use the arrow keys to read the signal'}
		onpointermove={point}
		onpointerdown={point}
		onpointerleave={() => (index = null)}
		onblur={() => (index = null)}
		{onkeydown}
	>
		<svg viewBox="0 0 {W} {H}" preserveAspectRatio="none" aria-hidden="true">
			<line class="axis" x1="0" x2={W} y1={H / 2} y2={H / 2} />
			{#each ticks as t (t)}
				<line class="tick" x1={(x(t) * W) / 100} x2={(x(t) * W) / 100} y1={H / 2 - 5} y2={H / 2 + 5} />
			{/each}
			<line class="merger" x1={(x(0) * W) / 100} x2={(x(0) * W) / 100} y1="0" y2={H} />
			<path class="trace" d={path} />
		</svg>

		{#if cursor}
			<div class="cursor" style:left="{cursor.x}%">
				<span class="dot" style:top="{cursor.y}%"></span>
			</div>
		{/if}

		<span class="annot y-label" aria-hidden="true">Strain</span>
		<div class="annot x-labels" aria-hidden="true">
			{#each ticks as t (t)}
				<span style:left="{x(t)}%" class:zero={t === 0}>{t === 0 ? 'Merger' : `${t < 0 ? '−' : '+'}${Math.abs(t).toFixed(2)} s`}</span>
			{/each}
		</div>
	</div>

	<figcaption>
		<p class="caption"><span class="annot number"></span>{caption}</p>
		<p class="annot readout" aria-hidden="true">
			{#if cursor}
				<span>t {formatTime(cursor.t)}</span><span>f {formatFreq(cursor.f)}</span>
			{:else}
				<span class="hint">Point at the signal to read it</span>
			{/if}
		</p>
	</figcaption>
</figure>

<style>
	.signal {
		counter-increment: figure;
	}

	.plot {
		position: relative;
		height: clamp(6rem, 10vw, 9.5rem);
		margin-bottom: 1.75rem;
		cursor: crosshair;
		touch-action: pan-y;
	}

	.plot:focus-visible {
		outline-offset: 0.75rem;
	}

	svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	svg * {
		vector-effect: non-scaling-stroke;
	}

	.axis,
	.tick {
		stroke: var(--rule-strong);
		stroke-width: 1;
	}

	.merger {
		stroke: var(--rule);
		stroke-dasharray: 3 4;
	}

	.trace {
		fill: none;
		stroke: var(--spot);
		stroke-width: 1.5;
		stroke-linejoin: round;
		animation: sweep 2.2s var(--ease-in-out) 0.5s backwards;
	}

	/* Drawn left to right once, like a trace on a scope. */
	@keyframes sweep {
		from {
			clip-path: inset(0 100% 0 0);
		}
	}

	.cursor {
		position: absolute;
		inset-block: -0.5rem;
		width: 1px;
		background: var(--ink);
		pointer-events: none;
	}

	.dot {
		position: absolute;
		left: 0;
		width: 9px;
		height: 9px;
		border: 2px solid var(--paper);
		border-radius: 50%;
		background: var(--spot);
		translate: -50% -50%;
		transition: top 60ms linear;
	}

	.y-label {
		position: absolute;
		top: 0;
		left: 0;
	}

	/* Units keep their case: s and Hz. */
	.x-labels,
	.readout {
		text-transform: none;
	}

	.x-labels .zero {
		text-transform: uppercase;
	}

	.x-labels {
		position: absolute;
		inset-inline: 0;
		top: calc(100% + 0.5rem);
	}

	.x-labels span {
		position: absolute;
		translate: -50% 0;
		white-space: nowrap;
	}

	.x-labels span:first-child {
		translate: 0;
	}

	.x-labels .zero {
		color: var(--spot);
	}

	figcaption {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-2xs) var(--space-l);
		padding-top: var(--space-2xs);
		border-top: 1px solid var(--rule);
	}

	.caption {
		max-width: 60ch;
		font-size: var(--step--1);
		color: var(--ink-2);
	}

	.number {
		margin-right: 0.75em;
		color: var(--ink);
	}

	.number::before {
		content: 'Fig. ' counter(figure);
	}

	.hint {
		text-transform: uppercase;
	}

	.readout {
		display: flex;
		gap: 1.5em;
		min-width: 16em;
		justify-content: flex-end;
	}

	@media (max-width: 600px) {
		.x-labels span:nth-child(even):not(.zero) {
			display: none;
		}

		.readout {
			justify-content: flex-start;
		}
	}
</style>
