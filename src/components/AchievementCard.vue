<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import type { Achievement } from '@/types/achievement';
import LockIcon from '@/assets/icons/lock.svg?component';
import AwardIcon from '@/assets/icons/award.svg?component';

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

const router = useRouter();

function onClick() {
	if (interactive && achievement.id) {
		router.push(`/achievement/${achievement.id}`);
	}
}

const cardEl = ref<HTMLElement | null>(null);
const cardW = ref(380);
const cardH = ref(88);
let resizeObs: ResizeObserver | null = null;

onMounted(() => {
	if (!cardEl.value) return;

	cardW.value = cardEl.value.offsetWidth;
	cardH.value = cardEl.value.offsetHeight;
	resizeObs = new ResizeObserver(() => {
		cardW.value = cardEl.value?.offsetWidth ?? 380;
		cardH.value = cardEl.value?.offsetHeight ?? 88;
	});
	resizeObs.observe(cardEl.value);
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
	<div
		ref="cardEl"
		class="achievement-card"
		:class="[
			`theme-${achievement.theme}`,
			{
				'is-locked': !achievement.unlocked,
				'is-large': size === 'large',
				'is-interactive': interactive,
			},
		]"
		@click="onClick"
	>
		<!-- Clipped background decorations (strict overflow:hidden) -->
		<div class="card-clip-bg">
			<!-- Retro: checkered stripe on right edge + loop SVG -->
			<template v-if="achievement.theme === 'retro' && achievement.unlocked">
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
						v-for="i in 14"
						:key="i"
						class="retro-check-cell"
						:class="i % 2 === 0 ? 'even' : 'odd'"
					/>
				</div>
			</template>

			<!-- Cozy: coffee cup watermark -->
			<svg
				v-if="achievement.theme === 'cozy' && achievement.unlocked"
				class="cozy-coffee-svg"
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

			<!-- Forest: campfire watermark -->
			<svg
				v-if="achievement.theme === 'forest' && achievement.unlocked"
				class="forest-fire-svg"
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
		</div>

		<!-- Floating theme decorations (overflow visible) -->
		<template v-if="achievement.unlocked">
			<!-- Retro floating elements -->
			<div
				v-if="achievement.theme === 'retro'"
				class="retro-floating"
				aria-hidden="true"
			>
				<span class="pixel-coin">★</span>
				<span class="pixel-star" />
				<span class="retro-text">[1UP]</span>
			</div>
			<!-- Cozy steam -->
			<div
				v-if="achievement.theme === 'cozy'"
				class="cozy-floating"
				aria-hidden="true"
			>
				<span class="steam-1">♨</span>
				<span class="steam-2">♨</span>
			</div>
			<!-- Forest leaves -->
			<div
				v-if="achievement.theme === 'forest'"
				class="forest-floating"
				aria-hidden="true"
			>
				<span class="leaf-1">🍃</span>
				<span class="leaf-2">🍂</span>
			</div>
		</template>

		<!-- Cyber: PS controller buttons floating -->
		<div
			v-if="achievement.theme === 'cyber' && achievement.unlocked"
			class="cyber-floating"
			aria-hidden="true"
		>
			<span class="cyber-square" />
			<span class="cyber-triangle" />
			<span class="cyber-cross">✕</span>
			<span class="cyber-circle" />
		</div>

		<!-- Cyber: SVG cable + gamepad -->
		<template v-if="achievement.theme === 'cyber' && achievement.unlocked">
			<!-- Segment 1: sweeps under the card (z-index -10) -->
			<svg class="cable-svg cable-z-under" aria-hidden="true">
				<path
					class="wire-path wire-path--1"
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
			<!-- Segment 2: sweeps over the card (z-index 35) -->
			<svg class="cable-svg cable-z-over" aria-hidden="true">
				<path
					class="wire-path wire-path--2"
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
			<!-- Gamepad emoji sticking out to the right -->
			<span class="cyber-gamepad" aria-hidden="true">🎮</span>
		</template>

		<!-- Bottom neon strip for cyber/retro -->
		<div
			v-if="
				achievement.unlocked &&
				(achievement.theme === 'cyber' || achievement.theme === 'retro')
			"
			class="neon-strip"
		/>

		<!-- Main card content -->
		<div class="card-content">
			<!-- Left: Avatar circle -->
			<div class="avatar-section">
				<div
					class="avatar-circle"
					:class="{
						'circle-cyber':
							achievement.theme === 'cyber' && achievement.unlocked,
					}"
				>
					<!-- Cyber crosshair outline -->
					<svg
						v-if="achievement.theme === 'cyber' && achievement.unlocked"
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
						<line
							x1="50"
							y1="0"
							x2="50"
							y2="6"
							stroke="#10b981"
							stroke-width="3"
						/>
						<line
							x1="50"
							y1="94"
							x2="50"
							y2="100"
							stroke="#10b981"
							stroke-width="3"
						/>
						<line
							x1="0"
							y1="50"
							x2="6"
							y2="50"
							stroke="#10b981"
							stroke-width="3"
						/>
						<line
							x1="94"
							y1="50"
							x2="100"
							y2="50"
							stroke="#10b981"
							stroke-width="3"
						/>
					</svg>
					<!-- Retro dashed outline -->
					<div
						v-if="achievement.theme === 'retro' && achievement.unlocked"
						class="retro-circle-outline"
					/>

					<template v-if="achievement.unlocked">
						<img
							v-if="achievement.imageUrl"
							:src="achievement.imageUrl"
							:alt="achievement.title"
							referrerpolicy="no-referrer"
							class="avatar-img"
						/>
						<div v-else class="avatar-placeholder">✦</div>
					</template>
					<div v-else class="avatar-locked">
						<LockIcon class="lock-icon" />
						<span class="locked-label">LOCKED</span>
					</div>
				</div>

				<!-- Retro: sonic sprite -->
				<span
					v-if="
						achievement.theme === 'retro' &&
						achievement.unlocked &&
						size !== 'large'
					"
					class="sonic-sprite"
					aria-hidden="true"
					>🦔</span
				>
			</div>

			<!-- Middle: Text -->
			<div class="card-text">
				<div class="title-row">
					<h3 class="card-title">{{ achievement.title }}</h3>
					<span v-if="achievement.unlocked" class="unlocked-badge"
						>UNLOCKED</span
					>
				</div>
				<p class="card-subtitle">
					{{ achievement.subtitle ?? achievement.description }}
				</p>
				<p
					v-if="
						size === 'large' && achievement.description && achievement.subtitle
					"
					class="card-desc"
				>
					{{ achievement.description }}
				</p>
			</div>
		</div>

		<!-- Points badge (absolute right) -->
		<div class="points-badge">
			<div class="points-pill">
				<AwardIcon class="award-icon" />
				<span>{{ achievement.points ?? 0 }}G</span>
			</div>
			<span
				v-if="achievement.unlocked && achievement.unlockedAt"
				class="unlock-date"
			>
				{{ new Date(achievement.unlockedAt).toLocaleDateString('ru-RU') }}
			</span>
		</div>
	</div>
</template>

<style scoped>
/* ══════════════════════════════
   BASE CARD
══════════════════════════════ */
.achievement-card {
	position: relative;
	display: flex;
	align-items: center;
	border: 1px solid;
	border-radius: 32px;
	padding: 5px 72px 5px 5px;
	min-height: 5.5rem;
	transition:
		transform 0.25s ease,
		box-shadow 0.25s ease;
	overflow: visible;
	width: 100%;
}

.achievement-card.is-large {
	border-radius: 9999px;
	padding: 5px 80px 5px 5px;
	min-height: auto;
}

.achievement-card.is-interactive {
	cursor: pointer;
}

.achievement-card.is-interactive:hover {
	transform: scale(1.015) translateY(-2px);
}

/* ══════════════════════════════
   CLIPPED BACKGROUND
══════════════════════════════ */
.card-clip-bg {
	position: absolute;
	inset: 0;
	border-radius: inherit;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
}

/* Retro decorations */
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

/* Cozy coffee cup */
.cozy-coffee-svg {
	position: absolute;
	right: 8px;
	bottom: 8px;
	width: 60px;
	height: 60px;
	opacity: 0.2;
}

.is-large .cozy-coffee-svg {
	width: 96px;
	height: 96px;
}

/* Forest campfire */
.forest-fire-svg {
	position: absolute;
	right: 16px;
	bottom: 8px;
	width: 56px;
	height: 56px;
	opacity: 0.25;
}

.is-large .forest-fire-svg {
	width: 96px;
	height: 96px;
}

/* ══════════════════════════════
   FLOATING DECORATIONS
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
	font-weight: 700;
	animation: float-bounce 2.5s ease-in-out infinite;
	box-shadow: 0 0 6px rgba(234, 179, 8, 0.5);
}

.pixel-star {
	position: absolute;
	bottom: 8px;
	left: 58%;
	width: 12px;
	height: 12px;
	background: #a5b4fc;
	animation: spin-scale 8s linear infinite;
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
	font-family: monospace;
	font-size: 10px;
	color: #34d399;
	opacity: 0.8;
	animation: float-bounce 4s ease-in-out infinite;
}

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
	animation: steam-rise 6s ease-in-out infinite;
}

.steam-2 {
	position: absolute;
	bottom: 8px;
	left: 62%;
	font-size: 12px;
	color: #d97706;
	opacity: 0.65;
	animation: steam-rise 5s ease-in-out infinite 1s;
}

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
	animation: leaf-drift 7s ease-in-out infinite;
}

.leaf-2 {
	position: absolute;
	bottom: 8px;
	left: 55%;
	font-size: 10px;
	opacity: 0.7;
	animation: leaf-drift-reverse 8s ease-in-out infinite 1.5s;
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
	animation: float-rotate 4s ease-in-out infinite;
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
	animation: float-drift 5s ease-in-out infinite 0.5s;
}

.cyber-cross {
	position: absolute;
	bottom: 16px;
	left: 53%;
	font-size: 16px;
	font-weight: 700;
	color: #818cf8;
	opacity: 0.9;
	filter: drop-shadow(0 0 6px rgba(129, 140, 248, 0.6));
	animation: float-spin 4.5s ease-in-out infinite 1s;
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
	animation: float-bounce 6s ease-in-out infinite;
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
	background: linear-gradient(
		to right,
		transparent,
		var(--theme-neon, #34d399),
		transparent
	);
	pointer-events: none;
	z-index: 5;
}

.theme-cyber .neon-strip {
	background: linear-gradient(to right, transparent, #34d399, transparent);
	box-shadow: 0 0 4px #34d399;
}

.theme-retro .neon-strip {
	background: linear-gradient(to right, transparent, #818cf8, transparent);
}

/* ══════════════════════════════
   CARD CONTENT
══════════════════════════════ */
.card-content {
	display: flex;
	align-items: center;
	gap: 16px;
	z-index: 20;
	width: 100%;
	position: relative;
}

/* ══════════════════════════════
   AVATAR SECTION
══════════════════════════════ */
.avatar-section {
	flex-shrink: 0;
	position: relative;
}

.avatar-circle {
	position: relative;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 2px solid;
	transition: all 0.3s ease;
	flex-shrink: 0;
}

.is-large .avatar-circle {
	width: 96px;
	height: 96px;
}

.avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.5s ease;
}

.is-interactive:hover .avatar-img {
	transform: scale(1.1);
}

.avatar-placeholder {
	font-size: 1.5rem;
}

.avatar-locked {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2px;
	width: 100%;
	height: 100%;
}

.lock-icon {
	width: 22px;
	height: 22px;
}

.locked-label {
	font-family: monospace;
	font-size: 7px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

/* Cyber crosshair */
.cyber-crosshair {
	position: absolute;
	inset: -6px;
	width: calc(100% + 12px);
	height: calc(100% + 12px);
	pointer-events: none;
	z-index: 10;
	overflow: visible;
}

/* Retro dashed outline */
.retro-circle-outline {
	position: absolute;
	inset: -4px;
	border: 2px dashed #818cf8;
	border-radius: 50%;
	pointer-events: none;
	z-index: 10;
}

/* Sonic sprite */
.sonic-sprite {
	position: absolute;
	bottom: -8px;
	left: -4px;
	font-size: 12px;
	user-select: none;
}

/* ══════════════════════════════
   CARD TEXT
══════════════════════════════ */
.card-text {
	flex-grow: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.title-row {
	display: flex;
	align-items: center;
	gap: 8px;
	flex-wrap: wrap;
}

.card-title {
	margin: 0;
	font-size: 1rem;
	font-weight: 700;
	line-height: 1.2;
	letter-spacing: -0.01em;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
}

.is-large .card-title {
	font-size: 1.25rem;
}

.unlocked-badge {
	display: inline-flex;
	align-items: center;
	font-family: monospace;
	font-size: 8px;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	background: rgba(16, 185, 129, 0.2);
	color: #34d399;
	padding: 2px 6px;
	border-radius: 2px;
	border: 1px solid rgba(16, 185, 129, 0.3);
	white-space: nowrap;
	flex-shrink: 0;
	animation: badge-pop 0.3s ease;
}

.card-subtitle {
	margin: 0;
	font-size: 0.8rem;
	line-height: 1.4;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.card-desc {
	margin: 0;
	font-size: 0.75rem;
	line-height: 1.5;
	opacity: 0.7;
	display: none;
}

@media (min-width: 640px) {
	.is-large .card-desc {
		display: block;
	}
}

/* ══════════════════════════════
   POINTS BADGE
══════════════════════════════ */
.award-icon {
	width: 12px;
	height: 12px;
	flex-shrink: 0;
}

.points-badge {
	position: absolute;
	right: 12px;
	top: 50%;
	transform: translateY(-50%);
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 4px;
	z-index: 30;
	pointer-events: none;
	user-select: none;
}

.is-large .points-badge {
	right: 20px;
}

.points-pill {
	display: flex;
	align-items: center;
	gap: 4px;
	font-family: monospace;
	font-size: 0.72rem;
	font-weight: 700;
	padding: 3px 8px;
	border-radius: 9999px;
	border: 1px solid;
	white-space: nowrap;
}

.unlock-date {
	font-family: monospace;
	font-size: 0.62rem;
	opacity: 0.6;
	display: none;
}

@media (min-width: 640px) {
	.unlock-date {
		display: block;
	}
}

/* ══════════════════════════════
   THEME: CYBER
══════════════════════════════ */
.theme-cyber {
	background: var(--cyber-card-bg);
	border-color: var(--cyber-card-border);
	color: var(--cyber-card-text);
	box-shadow: 0 8px 24px var(--cyber-glow);
}

.theme-cyber.is-interactive:hover {
	border-color: #10b981;
	box-shadow: 0 12px 32px var(--cyber-glow);
}

.theme-cyber .avatar-circle {
	background: var(--cyber-circle-bg);
	border-color: var(--cyber-circle-border);
	box-shadow: 0 0 0 4px var(--cyber-circle-ring);
	color: var(--cyber-circle-text);
}

.theme-cyber .card-title {
	color: var(--cyber-card-title);
}

.theme-cyber.is-interactive:hover .card-title {
	color: #34d399;
}

.theme-cyber .card-subtitle {
	color: var(--cyber-card-text);
	opacity: 0.8;
}

.theme-cyber .points-pill {
	background: var(--cyber-badge-bg);
	color: var(--cyber-badge-text);
	border-color: var(--cyber-badge-border);
}

.theme-cyber .unlock-date {
	color: var(--cyber-badge-text);
}

/* ══════════════════════════════
   THEME: RETRO
══════════════════════════════ */
.theme-retro {
	background: var(--retro-card-bg);
	border-color: var(--retro-card-border);
	color: var(--retro-card-text);
	box-shadow: 0 8px 20px var(--retro-glow);
}

.theme-retro.is-interactive:hover {
	border-color: #818cf8;
	box-shadow: 0 12px 28px var(--retro-glow);
}

.theme-retro .avatar-circle {
	background: var(--retro-circle-bg);
	border-color: var(--retro-circle-border);
	box-shadow: 0 0 0 4px var(--retro-circle-ring);
	color: var(--retro-circle-text);
}

.theme-retro .card-title {
	font-family: monospace;
	color: var(--retro-card-title);
}

.theme-retro.is-interactive:hover .card-title {
	color: #fbbf24;
}

.theme-retro .card-subtitle {
	font-family: monospace;
	font-size: 0.72rem;
	color: var(--retro-card-text);
	opacity: 0.8;
}

.theme-retro .points-pill {
	background: var(--retro-badge-bg);
	color: var(--retro-badge-text);
	border-color: var(--retro-badge-border);
}

/* ══════════════════════════════
   THEME: COZY
══════════════════════════════ */
.theme-cozy {
	background: var(--cozy-card-bg);
	border-color: var(--cozy-card-border);
	color: var(--cozy-card-text);
	box-shadow: 0 8px 20px var(--cozy-glow);
}

.theme-cozy.is-interactive:hover {
	border-color: #f59e0b;
	box-shadow: 0 12px 28px var(--cozy-glow);
}

.theme-cozy .avatar-circle {
	background: var(--cozy-circle-bg);
	border-color: var(--cozy-circle-border);
	box-shadow: 0 0 0 4px var(--cozy-circle-ring);
	color: var(--cozy-circle-text);
}

.theme-cozy .card-title {
	font-family: Georgia, serif;
	color: var(--cozy-card-title);
}

.theme-cozy.is-interactive:hover .card-title {
	color: #fcd34d;
}

.theme-cozy .card-subtitle {
	color: var(--cozy-card-text);
	opacity: 0.8;
}

.theme-cozy .points-pill {
	background: var(--cozy-badge-bg);
	color: var(--cozy-badge-text);
	border-color: var(--cozy-badge-border);
}

/* ══════════════════════════════
   THEME: FOREST
══════════════════════════════ */
.theme-forest {
	background: var(--forest-card-bg);
	border-color: var(--forest-card-border);
	color: var(--forest-card-text);
	box-shadow: 0 8px 20px var(--forest-glow);
}

.theme-forest.is-interactive:hover {
	border-color: #10b981;
	box-shadow: 0 12px 28px var(--forest-glow);
}

.theme-forest .avatar-circle {
	background: var(--forest-circle-bg);
	border-color: var(--forest-circle-border);
	box-shadow: 0 0 0 4px var(--forest-circle-ring);
	color: var(--forest-circle-text);
}

.theme-forest .card-title {
	color: var(--forest-card-title);
}

.theme-forest.is-interactive:hover .card-title {
	color: #6ee7b7;
}

.theme-forest .card-subtitle {
	color: var(--forest-card-text);
	opacity: 0.8;
}

.theme-forest .points-pill {
	background: var(--forest-badge-bg);
	color: var(--forest-badge-text);
	border-color: var(--forest-badge-border);
}

/* ══════════════════════════════
   THEME: DEFAULT
══════════════════════════════ */
.theme-default {
	background: var(--default-card-bg);
	border-color: var(--default-card-border);
	color: var(--default-card-text);
}

.theme-default .avatar-circle {
	background: var(--default-circle-bg);
	border-color: var(--default-circle-border);
	box-shadow: 0 0 0 4px var(--default-circle-ring);
	color: var(--default-circle-text);
}

.theme-default .card-title {
	color: var(--default-card-title);
}

.theme-default .points-pill {
	background: var(--default-badge-bg);
	color: var(--default-badge-text);
	border-color: var(--default-badge-border);
}

/* ══════════════════════════════
   LOCKED STATE (overrides theme)
══════════════════════════════ */
.is-locked {
	background: var(--locked-card-bg) !important;
	border-color: var(--locked-card-border) !important;
	filter: saturate(0.5);
	box-shadow: none !important;
}

.is-locked .avatar-circle {
	background: var(--locked-circle-bg) !important;
	border-color: var(--locked-circle-border) !important;
	box-shadow: none !important;
	color: var(--locked-circle-text) !important;
}

.is-locked .card-title {
	color: var(--locked-circle-text) !important;
}

.is-locked .card-subtitle {
	color: var(--locked-circle-text) !important;
}

.is-locked .points-pill {
	background: var(--locked-badge-bg) !important;
	color: var(--locked-badge-text) !important;
	border-color: var(--locked-badge-border) !important;
}

/* ══════════════════════════════
   KEYFRAME ANIMATIONS
══════════════════════════════ */
@keyframes float-bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

@keyframes float-rotate {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-12px) rotate(45deg);
	}
}

@keyframes float-drift {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-14px) rotate(-25deg);
	}
}

@keyframes float-spin {
	0%,
	100% {
		transform: translateY(0) rotate(0deg);
	}
	50% {
		transform: translateY(-10px) rotate(90deg);
	}
}

@keyframes spin-scale {
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

@keyframes steam-rise {
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

@keyframes leaf-drift {
	0%,
	100% {
		transform: translateY(0) translateX(0) rotate(0deg);
	}
	50% {
		transform: translateY(12px) translateX(8px) rotate(90deg);
	}
}

@keyframes leaf-drift-reverse {
	0%,
	100% {
		transform: translateY(0) translateX(0) rotate(0deg);
	}
	50% {
		transform: translateY(-12px) translateX(-8px) rotate(-60deg);
	}
}

@keyframes badge-pop {
	from {
		transform: scale(0.8);
		opacity: 0;
	}
	to {
		transform: scale(1);
		opacity: 1;
	}
}

/* ══════════════════════════════
   CYBER: SVG CABLE
══════════════════════════════ */
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
	stroke-dasharray: 2000;
	stroke-dashoffset: 2000;
}

.wire-path--1 {
	animation: draw-wire 0.9s ease-out forwards;
}

.wire-path--2 {
	animation: draw-wire 0.6s ease-out 0.8s forwards;
}

@keyframes draw-wire {
	to {
		stroke-dashoffset: 0;
	}
}

/* ══════════════════════════════
   CYBER: GAMEPAD EMOJI
══════════════════════════════ */
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
	transition:
		filter 0.3s ease,
		transform 0.3s ease;
}

.is-large .cyber-gamepad {
	right: -3.5rem;
	font-size: 5rem;
}

.is-interactive:hover .cyber-gamepad {
	filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.65)) brightness(1.15);
	transform: translateY(-50%) rotate(-40deg) scale(1.08);
}
</style>
