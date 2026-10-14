/**
 * A stylised gravitational-wave "chirp": the signal from two black holes
 * spiralling together. During the inspiral the frequency rises as
 * (t_c − t)^(−3/8) and the amplitude as f^(2/3); after the merger the signal
 * rings down at a fixed frequency. The numbers are loosely modelled on the
 * first detection (GW150914) so the readout values are plausible.
 */
export interface Chirp {
	/** Seconds relative to the merger. */
	t: number[]
	/** Strain, normalised to ±1. */
	h: number[]
	/** Frequency in Hz. */
	f: number[]
}

const INSPIRAL_K = 24 // Hz at one second before merger
const MERGE_TAU = 0.003 // seconds before merger at which the inspiral formula stops
const RING_F = 250 // Hz
const RING_DECAY = 0.004 // seconds

export function chirp(samples = 1200, start = -0.32, end = 0.03): Chirp {
	const t: number[] = []
	const h: number[] = []
	const f: number[] = []
	const dt = (end - start) / (samples - 1)
	const fMerge = INSPIRAL_K * MERGE_TAU ** -0.375
	let phase = 0
	let peak = 0

	for (let i = 0; i < samples; i++) {
		const time = start + i * dt
		let freq: number
		let amp: number
		if (time < -MERGE_TAU) {
			freq = INSPIRAL_K * (-time) ** -0.375
			amp = freq ** (2 / 3)
		} else {
			const since = time + MERGE_TAU
			freq = fMerge + (RING_F - fMerge) * (1 - Math.exp(-since / 0.002))
			amp = fMerge ** (2 / 3) * Math.exp(-since / RING_DECAY)
		}
		phase += 2 * Math.PI * freq * dt
		t.push(time)
		f.push(freq)
		h.push(amp * Math.cos(phase))
		peak = Math.max(peak, amp)
	}

	return { t, f, h: h.map((v) => v / peak) }
}

/** An SVG path for the signal, scaled to a `width` × `height` box with zero strain in the middle. */
export function chirpPath({ h }: Chirp, width: number, height: number): string {
	const mid = height / 2
	const step = width / (h.length - 1)
	return h.map((v, i) => `${i ? 'L' : 'M'}${(i * step).toFixed(2)} ${(mid - v * mid * 0.92).toFixed(2)}`).join('')
}
