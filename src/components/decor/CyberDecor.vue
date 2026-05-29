<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { ComponentPublicInstance } from 'vue';
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

const baseRef = ref<ComponentPublicInstance | null>(null);
const cardW = ref(380);
const cardH = ref(88);
let resizeObs: ResizeObserver | null = null;

onMounted(() => {
	const el = baseRef.value?.$el as HTMLElement | undefined;
	if (!el) return;

	cardW.value = el.offsetWidth;
	cardH.value = el.offsetHeight;
	resizeObs = new ResizeObserver(() => {
		cardW.value = (baseRef.value?.$el as HTMLElement)?.offsetWidth ?? 380;
		cardH.value = (baseRef.value?.$el as HTMLElement)?.offsetHeight ?? 88;
	});
	resizeObs.observe(el);
});

onUnmounted(() => resizeObs?.disconnect());

const cyberWire = computed(() => {
	const W = cardW.value;
	const H = cardH.value;
	const lg = size === 'large';
	const avatarW = lg ? 96 : 56;
	const x0 = 5 + avatarW / 2;
	const rectW = lg ? 12 : 8;
	const rectH = lg ? 16 : 10;
	const y0 = H - 2 + rectH;
	const yDown = y0 + (lg ? 65 : 40);
	const xTop = W - (lg ? 180 : 100);
	const yTop = lg ? -25 : -14;
	const xGamepad = W - (lg ? 25 : 12);
	const yGamepad = H / 2;
	const xEnd = xGamepad + 35;
	const yEnd = yGamepad + (lg ? 6 : 4);
	const u = lg ? 100 : 50;
	const v = lg ? 50 : 25;
	const sw = lg ? 3 : 1.8;

	return {
		path1: `M ${x0} ${y0} C ${x0} ${yDown}, ${xTop - u} ${yTop + v}, ${xTop} ${yTop}`,
		path2: `M ${xTop} ${yTop} C ${xTop + u} ${yTop - v}, ${xEnd - (lg ? 25 : 12)} ${yEnd - (lg ? 20 : 10)}, ${xEnd} ${yEnd}`,
		plugX: x0 - rectW / 2,
		plugY: H - 2,
		plugW: rectW,
		plugH: rectH,
		circleX: xEnd,
		circleY: yEnd,
		circleR: lg ? 14 : 8,
		sw,
	};
});
</script>

<template>
	<CardShell
		ref="baseRef"
		class="cyber-shell"
		:achievement="achievement"
		:size="size"
		:interactive="interactive"
	>
		<!-- Avatar ring: rotating crosshair -->
		<template #avatar-ring>
			<svg
				v-if="achievement.unlocked"
				class="cyber-crosshair"
				viewBox="0 0 100 100"
				aria-hidden="true"
			>
				<circle
					cx="50"
					cy="50"
					r="46"
					fill="none"
					stroke="#10b981"
					stroke-width="2.5"
					stroke-dasharray="64 12"
				/>
				<line x1="50" y1="0" x2="50" y2="6" stroke="#10b981" stroke-width="3" />
				<line
					x1="50"
					y1="94"
					x2="50"
					y2="100"
					stroke="#10b981"
					stroke-width="3"
				/>
				<line x1="0" y1="50" x2="6" y2="50" stroke="#10b981" stroke-width="3" />
				<line
					x1="94"
					y1="50"
					x2="100"
					y2="50"
					stroke="#10b981"
					stroke-width="3"
				/>
			</svg>
		</template>

		<template #decor>
			<template v-if="achievement.unlocked">
				<div class="cyber-floating" aria-hidden="true">
					<span class="cyber-square" />
					<span class="cyber-triangle" />
					<span class="cyber-cross">✕</span>
					<span class="cyber-circle" />
				</div>

				<!-- Cable segment 1: under the card -->
				<svg class="cable-svg cable-z-under" aria-hidden="true">
					<path
						class="wire-path"
						:d="cyberWire.path1"
						fill="none"
						stroke="#cccccc"
						:stroke-width="cyberWire.sw"
						stroke-linecap="round"
					/>
					<rect
						:x="cyberWire.plugX"
						:y="cyberWire.plugY"
						:width="cyberWire.plugW"
						:height="cyberWire.plugH"
						rx="2"
						fill="#9ca3af"
						opacity="0.95"
					/>
				</svg>

				<!-- Cable segment 2: over the card -->
				<svg class="cable-svg cable-z-over" aria-hidden="true">
					<path
						class="wire-path"
						:d="cyberWire.path2"
						fill="none"
						stroke="#cccccc"
						:stroke-width="cyberWire.sw"
						stroke-linecap="round"
					/>
					<circle
						:cx="cyberWire.circleX"
						:cy="cyberWire.circleY"
						:r="cyberWire.circleR"
						fill="none"
						stroke="#f97316"
						:stroke-width="cyberWire.sw + 0.7"
						opacity="0.95"
					/>
				</svg>

				<span
					class="cyber-gamepad"
					:class="{ 'cyber-gamepad--large': size === 'large' }"
					aria-hidden="true"
					>🎮</span
				>

				<div class="neon-strip" />
			</template>
		</template>
	</CardShell>
</template>

<style scoped>
.cyber-shell {
	--card-bg: var(--cyber-card-bg);
	--card-border-color: var(--cyber-card-border);
	--card-text-color: var(--cyber-card-text);
	--card-glow: var(--cyber-glow);
	--card-hover-border-color: #10b981;
	--card-hover-glow: var(--cyber-glow);
	--circle-bg: var(--cyber-circle-bg);
	--circle-border-color: var(--cyber-circle-border);
	--circle-ring: var(--cyber-circle-ring);
	--circle-text-color: var(--cyber-circle-text);
	--title-color: var(--cyber-card-title);
	--title-hover-color: #34d399;
	--badge-bg: var(--cyber-badge-bg);
	--badge-text-color: var(--cyber-badge-text);
	--badge-border-color: var(--cyber-badge-border);
}

.cyber-crosshair {
	position: absolute;
	inset: -6px;
	width: calc(100% + 12px);
	height: calc(100% + 12px);
	pointer-events: none;
	z-index: 10;
	overflow: visible;
}

.cyber-floating {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: visible;
	z-index: 30;
}

.cyber-square {
	position: absolute;
	bottom: 12px;
	left: 28%;
	width: 22px;
	height: 22px;
	border: 2px solid #f472b6;
	border-radius: 4px;
	opacity: 0.8;
	box-shadow: 0 0 8px rgba(244, 114, 182, 0.5);
	animation: cyber-float-rotate 4s ease-in-out infinite;
}

.cyber-triangle {
	position: absolute;
	bottom: 8px;
	left: 45%;
	width: 0;
	height: 0;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-bottom: 18px solid #2dd4bf;
	opacity: 0.9;
	filter: drop-shadow(0 0 6px rgba(45, 212, 191, 0.6));
	animation: cyber-float-drift 5s ease-in-out infinite 0.5s;
}

.cyber-cross {
	position: absolute;
	bottom: 16px;
	left: 53%;
	font-size: 16px;
	font-weight: var(--font-bold);
	color: #818cf8;
	opacity: 0.9;
	filter: drop-shadow(0 0 6px rgba(129, 140, 248, 0.6));
	animation: cyber-float-spin 4.5s ease-in-out infinite 1s;
}

.cyber-circle {
	position: absolute;
	top: 8px;
	right: 18%;
	width: 18px;
	height: 18px;
	border: 2px solid #f97316;
	border-radius: 50%;
	opacity: 0.9;
	box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
	animation: cyber-float-bounce 6s ease-in-out infinite;
}

.cable-svg {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	overflow: visible;
}

.cable-z-under {
	z-index: -10;
}

.cable-z-over {
	z-index: 35;
}

.wire-path {
	opacity: 0.85;
}

.cyber-gamepad {
	position: absolute;
	right: -0.75rem;
	top: 50%;
	transform: translateY(-50%) rotate(-40deg);
	font-size: 2.5rem;
	z-index: 40;
	pointer-events: none;
	user-select: none;
	filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.65));
}

.cyber-gamepad--large {
	right: -3.5rem;
	font-size: 5rem;
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
	background: linear-gradient(to right, transparent, #34d399, transparent);
	box-shadow: 0 0 4px #34d399;
	pointer-events: none;
	z-index: 5;
}

/* ══════════════════════════════
   KEYFRAMES
══════════════════════════════ */
@keyframes cyber-float-bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

@keyframes cyber-float-rotate {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-12px) rotate(45deg);
	}
}

@keyframes cyber-float-drift {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-14px) rotate(-25deg);
	}
}

@keyframes cyber-float-spin {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-10px) rotate(90deg);
	}
}

</style>
