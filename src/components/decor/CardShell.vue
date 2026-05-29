<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Achievement } from '@/types/achievement';
import UiImage from '@/components/ui/UiImage.vue';
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
		<div class="card-clip-bg">
			<slot name="card-background" />
		</div>

		<slot name="decor" />

		<div class="card-content">
			<div class="avatar-section">
				<div class="avatar-circle">
					<slot name="avatar-ring" />

					<template v-if="achievement.unlocked">
						<UiImage
							v-if="achievement.imageUrl"
							:src="achievement.imageUrl"
							:alt="achievement.title"
							size="full"
							class="avatar-img"
						/>
						<div v-else class="avatar-placeholder">✦</div>
					</template>
					<div v-else class="avatar-locked">
						<LockIcon class="lock-icon" />
						<span class="locked-label">LOCKED</span>
					</div>
				</div>

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
.achievement-card {
	position: relative;
	display: flex;
	align-items: center;
	border: 1px solid var(--card-border-color);
	border-radius: 32px;
	padding: 5px 72px 5px 5px;
	min-height: 5.5rem;
	background: var(--card-bg);
	color: var(--card-text-color);
	box-shadow: 0 8px 24px var(--card-glow, transparent);
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
	border-color: var(--card-hover-border-color, var(--card-border-color));
	box-shadow: 0 12px 32px var(--card-hover-glow, transparent);
}

.card-clip-bg {
	position: absolute;
	inset: 0;
	border-radius: inherit;
	overflow: hidden;
	pointer-events: none;
	z-index: 0;
}

.card-content {
	display: flex;
	align-items: center;
	gap: 16px;
	z-index: 20;
	width: 100%;
	position: relative;
}

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
	border: 2px solid var(--circle-border-color);
	background: var(--circle-bg);
	box-shadow: 0 0 0 4px var(--circle-ring, transparent);
	color: var(--circle-text-color);
	transition: all 0.3s ease;
	flex-shrink: 0;
}

.is-large .avatar-circle {
	width: 96px;
	height: 96px;
}

.avatar-img {
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
	color: var(--title-color);
	font-family: var(--title-font, inherit);
}

.is-large .card-title {
	font-size: 1.25rem;
}

.is-interactive:hover .card-title {
	color: var(--title-hover-color, var(--title-color));
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
	font-size: var(--subtitle-size, 0.8rem);
	font-family: var(--subtitle-font, inherit);
	line-height: 1.4;
	opacity: 0.8;
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
	border: 1px solid var(--badge-border-color);
	background: var(--badge-bg);
	color: var(--badge-text-color);
	white-space: nowrap;
}

.unlock-date {
	font-family: monospace;
	font-size: 0.62rem;
	opacity: 0.6;
	color: var(--badge-text-color);
	display: none;
}

@media (min-width: 640px) {
	.unlock-date {
		display: block;
	}
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
