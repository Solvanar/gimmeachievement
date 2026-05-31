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
const cardH = ref(72);
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

const gamingWire = computed(() => {
	const W = cardW.value;
	const H = cardH.value;
	const lg = size === 'large';

	const avatarW = lg ? 96 : 56;
	const rectW = lg ? 12 : 8;
	const rectH = lg ? 16 : 10;
	const x0 = 5 + avatarW / 2;
	const y0 = H - 2 + rectH;

	const yDown = y0 + H * 0.55;
	const xTop = W * 0.7;
	const yTop = -H * 0.2;
	const xGamepad = W - 20;
	const yGamepad = H / 2 - 5;
	const xEnd = xGamepad + W * 0.033;
	const yEnd = yGamepad + H * 0.05;

	const pathLen = xEnd - xTop;
	const pathH = yGamepad + Math.abs(yTop);
	const u = pathLen * 0.5;
	const vCoef = lg ? 0.24 : 0.2;
	const v = pathH * vCoef;
	const sw = Math.max(1.2, H * 0.025);

	// Угол входа шнура в геймпад: перпендикулярно его плоскости (CSS rotate = -40deg)
	const GAMEPAD_DEG = 40;
	const entryAngle = ((90 - GAMEPAD_DEG) * Math.PI) / 180;
	const cp2Len = pathLen * 0.18;
	const cp2xOff = cp2Len * Math.cos(entryAngle);
	const cp2yOff = cp2Len * Math.sin(entryAngle);

	// Сегментированное кольцо вокруг аватара — в координатах карточки (1:1 px)
	const avatarR = avatarW / 2;
	const ringC = 2 * Math.PI * avatarR;
	const ringGap = lg ? 20 : 12;
	const ringSegment = ringC / 4 - ringGap;
	const ringOffset = ringSegment + ringGap / 2;
	const ringW = lg ? 6 : 4;

	return {
		path1: `M ${x0} ${y0} C ${x0} ${yDown}, ${xTop - u} ${yTop + v}, ${xTop} ${yTop}`,
		path2: `M ${xTop} ${yTop} C ${xTop + u} ${yTop - v}, ${xEnd - cp2xOff} ${yEnd - cp2yOff}, ${xEnd} ${yEnd}`,
		plugX: x0 - rectW / 2,
		plugY: H - 2,
		plugW: rectW,
		plugH: rectH,
		sw,
		ringCx: x0,
		ringCy: H / 2,
		ringR: avatarR,
		ringW,
		ringGray: `${ringSegment} ${ringGap}`,
		ringGreen: `${ringSegment} ${ringC - ringSegment}`,
		ringOffset,
	};
});
</script>

<template>
	<CardShell
		ref="baseRef"
		class="gaming-shell"
		:achievement="achievement"
		:size="size"
		:interactive="interactive"
	>
		<template #avatar-ring>
			<svg
				v-if="achievement.unlocked"
				class="gaming-crosshair"
				viewBox="0 0 100 100"
				aria-hidden="true"
			>
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
				<div class="gaming-floating" aria-hidden="true">
					<span class="gaming-square" />
					<span class="gaming-triangle" />
					<span class="gaming-cross">✕</span>
					<span class="gaming-circle" />
				</div>

				<svg class="cable-svg cable-z-under" aria-hidden="true">
					<path
						class="wire-path"
						:d="gamingWire.path1"
						fill="none"
						stroke="#cccccc"
						:stroke-width="gamingWire.sw"
					/>
					<rect
						:x="gamingWire.plugX"
						:y="gamingWire.plugY"
						:width="gamingWire.plugW"
						:height="gamingWire.plugH"
						rx="2"
						fill="#9ca3af"
						opacity="0.95"
					/>
				</svg>

				<svg class="cable-svg cable-z-over" aria-hidden="true">
					<path
						class="wire-path"
						:d="gamingWire.path2"
						fill="none"
						stroke="#cccccc"
						:stroke-width="gamingWire.sw"
					/>
					<circle
						:cx="gamingWire.ringCx"
						:cy="gamingWire.ringCy"
						:r="gamingWire.ringR"
						fill="none"
						stroke="#4b5563"
						:stroke-width="gamingWire.ringW"
						:stroke-dasharray="gamingWire.ringGray"
						:stroke-dashoffset="gamingWire.ringOffset"
					/>
					<circle
						:cx="gamingWire.ringCx"
						:cy="gamingWire.ringCy"
						:r="gamingWire.ringR"
						fill="none"
						stroke="#10b981"
						:stroke-width="gamingWire.ringW"
						:stroke-dasharray="gamingWire.ringGreen"
						:stroke-dashoffset="gamingWire.ringOffset"
					/>
				</svg>

				<span
					class="gaming-gamepad"
					:class="{ 'gaming-gamepad--large': size === 'large' }"
					aria-hidden="true"
					>🎮</span
				>

				<div class="neon-strip" />
			</template>
		</template>
	</CardShell>
</template>

<style scoped>
.gaming-shell {
	--card-bg: var(--gaming-card-bg);
	--card-border-color: var(--gaming-card-border);
	--card-text-color: var(--gaming-card-text);
	--card-glow: var(--gaming-glow);
	--card-hover-border-color: #10b981;
	--card-hover-glow: var(--gaming-glow);
	--circle-bg: var(--gaming-circle-bg);
	--circle-border-color: transparent;
	--circle-ring: var(--gaming-circle-ring);
	--circle-text-color: var(--gaming-circle-text);
	--title-color: var(--gaming-card-title);
	--title-hover-color: #34d399;
	--badge-bg: var(--gaming-badge-bg);
	--badge-text-color: var(--gaming-badge-text);
	--badge-border-color: var(--gaming-badge-border);
	--points-badge-right-lg: 40px;
}

.gaming-crosshair {
	position: absolute;
	inset: -6px;
	width: calc(100% + 12px);
	height: calc(100% + 12px);
	pointer-events: none;
	z-index: 10;
	overflow: visible;
}

.gaming-floating {
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: visible;
	z-index: 30;
}

.gaming-square {
	position: absolute;
	bottom: -15px;
	left: 15%;
	width: 22px;
	height: 22px;
	border: 2px solid #f472b6;
	border-radius: 4px;
	opacity: 0.8;
	box-shadow: 0 0 8px rgba(244, 114, 182, 0.5);
	animation: gaming-float-rotate 4s ease-in-out infinite;
}

.gaming-triangle {
	position: absolute;
	top: 8px;
	left: 45%;
	width: 0;
	height: 0;
	border-left: 10px solid transparent;
	border-right: 10px solid transparent;
	border-bottom: 18px solid #2dd4bf;
	opacity: 0.9;
	filter: drop-shadow(0 0 6px rgba(45, 212, 191, 0.6));
	animation: gaming-float-drift 5s ease-in-out infinite 0.5s;
}

.gaming-cross {
	position: absolute;
	bottom: -10px;
	left: 70%;
	font-size: 20px;
	font-weight: var(--font-bold);
	color: #818cf8;
	opacity: 0.9;
	filter: drop-shadow(0 0 6px rgba(129, 140, 248, 0.6));
	animation: gaming-float-spin 4.5s ease-in-out infinite 1s;
}

.gaming-circle {
	position: absolute;
	top: 8px;
	right: 18%;
	width: 18px;
	height: 18px;
	border: 2px solid #f97316;
	border-radius: 50%;
	opacity: 0.9;
	box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
	animation: gaming-float-bounce 6s ease-in-out infinite;
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

.gaming-gamepad {
	position: absolute;
	right: -2.25rem;
	top: 50%;
	transform: translateY(-50%) rotate(-40deg);
	font-size: 2.5rem;
	z-index: 40;
	pointer-events: none;
	user-select: none;
	filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.65));
}

.gaming-gamepad--large {
	right: -3.5rem;
	font-size: 5rem;
}

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

@keyframes gaming-float-bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

@keyframes gaming-float-rotate {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-12px) rotate(45deg);
	}
}

@keyframes gaming-float-drift {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-14px) rotate(-25deg);
	}
}

@keyframes gaming-float-spin {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-10px) rotate(90deg);
	}
}
</style>
