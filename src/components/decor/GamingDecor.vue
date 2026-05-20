<script setup lang="ts">
defineProps<{ variant: 'card' | 'detail' }>();
</script>

<template>
	<svg
		class="gaming-decor"
		:viewBox="variant === 'card' ? '0 0 320 110' : '0 0 560 200'"
		overflow="visible"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
	>
		<!-- ══ PS BUTTONS ══
         Outer <g> — SVG positioning (immutable)
         Inner <g> — CSS float animation
    -->

		<!-- Triangle (green) -->
		<g
			:transform="
				variant === 'card'
					? 'translate(292, -20) rotate(-12)'
					: 'translate(530, -32) rotate(-12)'
			"
		>
			<g class="ps-btn btn-triangle">
				<circle
					class="btn-bg"
					cx="0"
					cy="0"
					:r="variant === 'card' ? 14 : 20"
				/>
				<polygon
					:points="variant === 'card' ? '0,-8 -7,5 7,5' : '0,-11 -10,7 10,7'"
					fill="none"
					stroke="#00B140"
					:stroke-width="variant === 'card' ? 2 : 2.5"
					stroke-linejoin="round"
				/>
				<circle
					class="btn-glow glow-triangle"
					cx="0"
					cy="0"
					:r="variant === 'card' ? 14 : 20"
					fill="none"
					:stroke-width="variant === 'card' ? 1 : 1.5"
				/>
			</g>
		</g>

		<!-- Cross (blue) -->
		<g
			:transform="
				variant === 'card' ? 'translate(348, 24)' : 'translate(596, 48)'
			"
		>
			<g class="ps-btn btn-cross">
				<circle
					class="btn-bg"
					cx="0"
					cy="0"
					:r="variant === 'card' ? 14 : 20"
				/>
				<line
					:x1="variant === 'card' ? -6.5 : -9"
					:y1="variant === 'card' ? -6.5 : -9"
					:x2="variant === 'card' ? 6.5 : 9"
					:y2="variant === 'card' ? 6.5 : 9"
					stroke="#4169E1"
					:stroke-width="variant === 'card' ? 2.5 : 3"
					stroke-linecap="round"
				/>
				<line
					:x1="variant === 'card' ? 6.5 : 9"
					:y1="variant === 'card' ? -6.5 : -9"
					:x2="variant === 'card' ? -6.5 : -9"
					:y2="variant === 'card' ? 6.5 : 9"
					stroke="#4169E1"
					:stroke-width="variant === 'card' ? 2.5 : 3"
					stroke-linecap="round"
				/>
				<circle
					class="btn-glow glow-cross"
					cx="0"
					cy="0"
					:r="variant === 'card' ? 14 : 20"
					fill="none"
					:stroke-width="variant === 'card' ? 1 : 1.5"
				/>
			</g>
		</g>

		<!-- Circle (red) -->
		<g
			:transform="
				variant === 'card' ? 'translate(352, 68)' : 'translate(602, 128)'
			"
		>
			<g class="ps-btn btn-circle">
				<circle
					class="btn-bg"
					cx="0"
					cy="0"
					:r="variant === 'card' ? 14 : 20"
				/>
				<circle
					cx="0"
					cy="0"
					:r="variant === 'card' ? 7 : 10"
					fill="none"
					stroke="#E8001C"
					:stroke-width="variant === 'card' ? 2 : 2.5"
				/>
				<circle
					class="btn-glow glow-circle"
					cx="0"
					cy="0"
					:r="variant === 'card' ? 14 : 20"
					fill="none"
					:stroke-width="variant === 'card' ? 1 : 1.5"
				/>
			</g>
		</g>

		<!-- Square (pink) -->
		<g
			:transform="
				variant === 'card'
					? 'translate(306, 130) rotate(8)'
					: 'translate(548, 228) rotate(8)'
			"
		>
			<g class="ps-btn btn-square">
				<circle
					class="btn-bg"
					cx="0"
					cy="0"
					:r="variant === 'card' ? 14 : 20"
				/>
				<rect
					:x="variant === 'card' ? -7 : -10"
					:y="variant === 'card' ? -7 : -10"
					:width="variant === 'card' ? 14 : 20"
					:height="variant === 'card' ? 14 : 20"
					rx="1.5"
					fill="none"
					stroke="#FF69B4"
					:stroke-width="variant === 'card' ? 2 : 2.5"
				/>
				<circle
					class="btn-glow glow-square"
					cx="0"
					cy="0"
					:r="variant === 'card' ? 14 : 20"
					fill="none"
					:stroke-width="variant === 'card' ? 1 : 1.5"
				/>
			</g>
		</g>
	</svg>
</template>

<style scoped>
.gaming-decor {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 20;
}

/* ── Cord ── */
.cord {
	fill: none;
	stroke-linecap: round;
	stroke-linejoin: round;
}
.cord-base {
	stroke: var(--gaming-cord-base);
	stroke-width: 7;
}
.cord-highlight {
	stroke: var(--gaming-cord-highlight);
	stroke-width: 4;
}
.cord-stripes {
	stroke: var(--gaming-cord-stripes);
	stroke-width: 1.5;
	stroke-dasharray: 3 6;
}

/* ── PS Buttons ── */
.btn-bg {
	fill: var(--gaming-ps-btn-bg);
}

.glow-triangle {
	stroke: rgba(0, 177, 64, 0.45);
}
.glow-cross {
	stroke: rgba(65, 105, 225, 0.45);
}
.glow-circle {
	stroke: rgba(232, 0, 28, 0.45);
}
.glow-square {
	stroke: rgba(255, 105, 180, 0.45);
}

.ps-btn {
	animation: float 3s ease-in-out infinite;
}
.btn-triangle {
	animation-delay: 0s;
}
.btn-cross {
	animation-delay: 0.75s;
}
.btn-circle {
	animation-delay: 1.5s;
}
.btn-square {
	animation-delay: 2.25s;
}

@keyframes float {
	0%,
	100% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-4px);
	}
}
</style>
