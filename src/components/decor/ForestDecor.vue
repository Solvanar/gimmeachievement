<script setup lang="ts">
import type { Achievement } from '@/types/achievement';
import BaseDecor from './BaseDecor.vue';

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
	<BaseDecor :achievement="achievement" :size="size" :interactive="interactive">
		<!-- Clipped background: campfire watermark -->
		<template #bg>
			<svg
				v-if="achievement.unlocked"
				class="forest-fire-svg"
				:class="{ 'forest-fire-svg--large': size === 'large' }"
				viewBox="0 0 120 120"
				aria-hidden="true"
			>
				<path
					d="M 30 85 L 90 65"
					stroke="#78350f"
					stroke-width="8"
					stroke-linecap="round"
				/>
				<path
					d="M 90 85 L 30 65"
					stroke="#78350f"
					stroke-width="8"
					stroke-linecap="round"
				/>
				<path
					d="M 40 70 C 40 40, 60 15, 60 15 C 60 15, 80 40, 80 70 C 80 90, 40 90, 40 70 Z"
					fill="#f97316"
					opacity="0.8"
				/>
				<path
					d="M 50 70 C 50 50, 60 30, 60 30 C 60 30, 70 50, 70 70 C 70 85, 50 85, 50 70 Z"
					fill="#facc15"
					opacity="0.9"
				/>
			</svg>
		</template>

		<!-- Floating: drifting leaves -->
		<template #decor>
			<div
				v-if="achievement.unlocked"
				class="forest-floating"
				aria-hidden="true"
			>
				<span class="leaf-1">🍃</span>
				<span class="leaf-2">🍂</span>
			</div>
		</template>
	</BaseDecor>
</template>

<style scoped>
/* ══════════════════════════════
   CLIPPED BACKGROUND
══════════════════════════════ */
.forest-fire-svg {
	position: absolute;
	right: 16px;
	bottom: 8px;
	width: 56px;
	height: 56px;
	opacity: 0.25;
}

.forest-fire-svg--large {
	width: 96px;
	height: 96px;
}

/* ══════════════════════════════
   FLOATING LEAVES
══════════════════════════════ */
.forest-floating {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: visible;
	z-index: 30;
}

.leaf-1 {
	position: absolute;
	top: 8px;
	left: 42%;
	font-size: 12px;
	opacity: 0.75;
	animation: forest-leaf-drift 7s ease-in-out infinite;
}

.leaf-2 {
	position: absolute;
	bottom: 8px;
	left: 55%;
	font-size: 10px;
	opacity: 0.7;
	animation: forest-leaf-drift-reverse 8s ease-in-out infinite 1.5s;
}

/* ══════════════════════════════
   KEYFRAMES
══════════════════════════════ */
@keyframes forest-leaf-drift {
	0%,
	100% {
		transform: translateY(0) translateX(0) rotate(0deg);
	}
	50% {
		transform: translateY(12px) translateX(8px) rotate(90deg);
	}
}

@keyframes forest-leaf-drift-reverse {
	0%,
	100% {
		transform: translateY(0) translateX(0) rotate(0deg);
	}
	50% {
		transform: translateY(-12px) translateX(-8px) rotate(-60deg);
	}
}
</style>
