<script setup lang="ts">
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
</script>

<template>
	<div
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
		<!-- Clipped background watermarks (overflow: hidden) -->
		<div class="card-clip-bg">
			<slot name="bg" />
		</div>

		<!-- Theme decorations: floats, cable, neon strip (overflow: visible) -->
		<slot name="decor" />

		<!-- Main card content -->
		<div class="card-content">
			<div class="avatar-section">
				<!-- Avatar circle: image or locked state -->
				<div class="avatar-circle">
					<!-- Theme-specific ring overlay: crosshair, dashed outline, etc. -->
					<slot name="avatar-ring" />

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

				<!-- Extra element beside avatar: sonic sprite, etc. -->
				<slot name="avatar-badge" />
			</div>

			<div class="card-text">
				<div class="title-row">
					<h3 class="card-title">{{ achievement.title }}</h3>
					<span v-if="achievement.unlocked" class="unlocked-badge">UNLOCKED</span>
				</div>
				<p class="card-subtitle">
					{{ achievement.subtitle ?? achievement.description }}
				</p>
				<p
					v-if="size === 'large' && achievement.description && achievement.subtitle"
					class="card-desc"
				>
					{{ achievement.description }}
				</p>
			</div>
		</div>

		<!-- Points pill + unlock date -->
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
   CLIPPED BACKGROUND WRAPPER
══════════════════════════════ */
.card-clip-bg {
	position: absolute;
	inset: 0;
	border-radius: inherit;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
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
   AVATAR
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
   LOCKED STATE
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
   KEYFRAMES
══════════════════════════════ */
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
</style>
