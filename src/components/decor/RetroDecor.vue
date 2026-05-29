<script setup lang="ts">
import type { Achievement } from '@/types/achievement';
import CardShell from './CardShell.vue';

interface Props {
	achievement: Achievement;
	size?: 'normal' | 'large';
	interactive?: boolean;
}

const {
	achievement,
	size = 'normal',
	interactive = true,
} = defineProps<Props>();
</script>

<template>
	<CardShell class="retro-shell" :achievement="achievement" :size="size" :interactive="interactive">
		<!-- Clipped background: waterfall stripe + loop SVG + checkerboard -->
		<template #card-background>
			<template v-if="achievement.unlocked">
				<div class="retro-waterfall" />
				<svg class="retro-loop-svg" viewBox="0 0 100 100" aria-hidden="true">
					<circle
						cx="50"
						cy="65"
						r="30"
						fill="none"
						stroke="#d97706"
						stroke-width="12"
					/>
					<circle
						cx="50"
						cy="65"
						r="30"
						fill="none"
						stroke="#f59e0b"
						stroke-width="8"
						stroke-dasharray="4 4"
					/>
					<path d="M 10 95 L 90 95" stroke="#16a34a" stroke-width="10" />
				</svg>
				<div class="retro-checks">
					<div
						v-for="cellIndex in 14"
						:key="cellIndex"
						class="retro-check-cell"
						:class="cellIndex % 2 === 0 ? 'even' : 'odd'"
					/>
				</div>
			</template>
		</template>

		<!-- Avatar ring: dashed outline -->
		<template #avatar-ring>
			<div v-if="achievement.unlocked" class="retro-circle-outline" />
		</template>

		<!-- Sonic sprite beside avatar -->
		<template #avatar-badge>
			<span
				v-if="achievement.unlocked && size !== 'large'"
				class="sonic-sprite"
				aria-hidden="true"
				>🦔</span
			>
		</template>

		<!-- Floating: pixel coin, star, [1UP] text + neon strip -->
		<template #decor>
			<template v-if="achievement.unlocked">
				<div class="retro-floating" aria-hidden="true">
					<span class="pixel-coin">★</span>
					<span class="pixel-star" />
					<span class="retro-text">[1UP]</span>
				</div>
				<div class="neon-strip" />
			</template>
		</template>
	</CardShell>
</template>

<style scoped>
.retro-shell {
	--card-bg: var(--retro-card-bg);
	--card-border-color: var(--retro-card-border);
	--card-text-color: var(--retro-card-text);
	--card-glow: var(--retro-glow);
	--card-hover-border-color: #818cf8;
	--card-hover-glow: var(--retro-glow);
	--circle-bg: var(--retro-circle-bg);
	--circle-border-color: var(--retro-circle-border);
	--circle-ring: var(--retro-circle-ring);
	--circle-text-color: var(--retro-circle-text);
	--title-color: var(--retro-card-title);
	--title-font: monospace;
	--title-hover-color: #fbbf24;
	--subtitle-font: monospace;
	--subtitle-size: 0.72rem;
	--badge-bg: var(--retro-badge-bg);
	--badge-text-color: var(--retro-badge-text);
	--badge-border-color: var(--retro-badge-border);
}

/* ══════════════════════════════
   CLIPPED BACKGROUND
══════════════════════════════ */
.retro-waterfall {
	position: absolute;
	top: 0;
	right: 4px;
	width: 10px;
	bottom: 0;
	background: linear-gradient(to bottom, #38bdf8, #3b82f6, #7dd3fc);
	opacity: 0.75;
}

.retro-loop-svg {
	position: absolute;
	right: 16px;
	bottom: 0;
	width: 60%;
	height: 83%;
	opacity: 0.3;
}

.retro-checks {
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 10px;
	display: flex;
	flex-direction: column;
}

.retro-check-cell {
	flex: 1;
}

.retro-check-cell.odd {
	background: #b45309;
}

.retro-check-cell.even {
	background: #eab308;
}

/* ══════════════════════════════
   AVATAR RING
══════════════════════════════ */
.retro-circle-outline {
	position: absolute;
	inset: -4px;
	border: 2px dashed #818cf8;
	border-radius: 50%;
	pointer-events: none;
	z-index: 10;
}

/* ══════════════════════════════
   SONIC SPRITE
══════════════════════════════ */
.sonic-sprite {
	position: absolute;
	bottom: -8px;
	left: -4px;
	font-size: 12px;
	user-select: none;
}

/* ══════════════════════════════
   FLOATING ELEMENTS
══════════════════════════════ */
.retro-floating {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: visible;
	z-index: 30;
}

.pixel-coin {
	position: absolute;
	top: 4px;
	left: 35%;
	width: 18px;
	height: 18px;
	background: #eab308;
	border: 1px solid #a16207;
	border-radius: 2px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 9px;
	color: #78350f;
	font-weight: var(--font-bold);
	animation: retro-float-bounce 2.5s ease-in-out infinite;
	box-shadow: 0 0 6px rgba(234, 179, 8, 0.5);
}

.pixel-star {
	position: absolute;
	bottom: 8px;
	left: 58%;
	width: 12px;
	height: 12px;
	background: #a5b4fc;
	animation: retro-spin-scale 8s linear infinite;
	clip-path: polygon(
		50% 0%,
		61% 35%,
		98% 35%,
		68% 57%,
		79% 91%,
		50% 70%,
		21% 91%,
		32% 57%,
		2% 35%,
		39% 35%
	);
}

.retro-text {
	position: absolute;
	top: 4px;
	right: 25%;
	font-family: var(--font-mono);
	font-size: 10px;
	color: #34d399;
	opacity: 0.8;
	animation: retro-float-bounce 4s ease-in-out infinite;
}

/* ══════════════════════════════
   NEON STRIP
══════════════════════════════ */
.neon-strip {
	position: absolute;
	bottom: 0;
	left: 60px;
	right: 60px;
	height: 1px;
	background: linear-gradient(to right, transparent, #818cf8, transparent);
	pointer-events: none;
	z-index: 5;
}

/* ══════════════════════════════
   KEYFRAMES
══════════════════════════════ */
@keyframes retro-float-bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

@keyframes retro-spin-scale {
	0% {
		transform: rotate(0deg) scale(0.8);
	}
	50% {
		transform: rotate(180deg) scale(1.2);
	}
	100% {
		transform: rotate(360deg) scale(0.8);
	}
}
</style>
