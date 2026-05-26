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
		<!-- Clipped background: coffee cup watermark -->
		<template #bg>
			<svg
				v-if="achievement.unlocked"
				class="cozy-coffee-svg"
				:class="{ 'cozy-coffee-svg--large': size === 'large' }"
				viewBox="0 0 120 120"
				aria-hidden="true"
			>
				<path
					d="M 20 40 L 100 40 C 100 80, 80 100, 50 100 C 20 100, 20 80, 20 40 Z"
					fill="#78350f"
				/>
				<path
					d="M 100 50 C 115 50, 115 75, 100 75"
					fill="none"
					stroke="#92400e"
					stroke-width="6"
				/>
				<ellipse cx="60" cy="40" rx="40" ry="10" fill="#78350f" />
				<ellipse cx="60" cy="40" rx="30" ry="6" fill="#f59e0b" opacity="0.7" />
				<path
					d="M 10 110 L 110 110"
					stroke="#92400e"
					stroke-width="8"
					stroke-linecap="round"
				/>
			</svg>
		</template>

		<!-- Floating: steam symbols -->
		<template #decor>
			<div v-if="achievement.unlocked" class="cozy-floating" aria-hidden="true">
				<span class="steam-1">♨</span>
				<span class="steam-2">♨</span>
			</div>
		</template>
	</BaseDecor>
</template>

<style scoped>
/* ══════════════════════════════
   CLIPPED BACKGROUND
══════════════════════════════ */
.cozy-coffee-svg {
	position: absolute;
	right: 8px;
	bottom: 8px;
	width: 60px;
	height: 60px;
	opacity: 0.2;
}

.cozy-coffee-svg--large {
	width: 96px;
	height: 96px;
}

/* ══════════════════════════════
   FLOATING STEAM
══════════════════════════════ */
.cozy-floating {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: visible;
	z-index: 30;
}

.steam-1 {
	position: absolute;
	top: 12px;
	left: 40%;
	font-size: 14px;
	color: #f59e0b;
	opacity: 0.65;
	animation: cozy-steam-rise 6s ease-in-out infinite;
}

.steam-2 {
	position: absolute;
	bottom: 8px;
	left: 62%;
	font-size: 12px;
	color: #d97706;
	opacity: 0.65;
	animation: cozy-steam-rise 5s ease-in-out infinite 1s;
}

/* ══════════════════════════════
   KEYFRAMES
══════════════════════════════ */
@keyframes cozy-steam-rise {
	0%,
	100% {
		transform: translateY(4px);
		opacity: 0.3;
	}
	50% {
		transform: translateY(-15px);
		opacity: 0.7;
	}
}
</style>
