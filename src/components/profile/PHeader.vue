<script setup lang="ts">
import type { UserProfile } from '@/stores/profile';
import UiImage from '@/components/ui/UiImage.vue';
import ShieldIcon from '@/assets/icons/shield.svg?component';
import CalendarIcon from '@/assets/icons/calendar.svg?component';
import StarIcon from '@/assets/icons/star.svg?component';

interface Props {
	profile: UserProfile;
	level: number;
	unlockedCount: number;
}

defineProps<Props>();

defineEmits<{ logout: [] }>();
</script>

<template>
	<div class="profile-card">
		<div class="profile-banner">
			<div class="banner-grid" />
			<div class="banner-glow-1" />
			<div class="banner-glow-2" />
			<span class="banner-level-tag">LVL {{ level }} ACHIEVEMENT HUNTER</span>
			<button class="logout-btn" type="button" @click="$emit('logout')">
				Выйти
			</button>
		</div>

		<div class="profile-body">
			<div class="profile-avatar-wrap">
				<UiImage
					:src="profile.avatar"
					:alt="profile.username"
					:size="112"
					shape="rounded"
					class="profile-avatar-img"
				/>
				<span class="online-dot" />
			</div>

			<div class="profile-info">
				<div class="profile-name-row">
					<h2 class="profile-name">{{ profile.username }}</h2>
					<span class="gamertag">@{{ profile.gamerTag }}</span>
					<span class="rank-badge">
						<ShieldIcon class="rank-icon" />
						{{ profile.rank }}
					</span>
				</div>
				<p class="profile-bio">{{ profile.bio }}</p>
				<div class="profile-meta">
					<span>
						<CalendarIcon class="meta-icon" />
						Зарегистрирован: {{ profile.joinDate }}
					</span>
					<span>
						<StarIcon class="meta-icon" />
						{{ unlockedCount }} ачивок получено
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.profile-card {
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 24px;
	overflow: hidden;
	box-shadow: var(--shadow-card);
}

.profile-banner {
	height: 160px;
	background: linear-gradient(135deg, #0f1f18, #070e1a, #1a0d12);
	position: relative;
	overflow: hidden;
}

.banner-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
		linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
	background-size: 24px 24px;
}

.banner-glow-1 {
	position: absolute;
	top: 16px;
	right: 40px;
	width: 96px;
	height: 96px;
	background: rgba(16, 185, 129, 0.1);
	border-radius: 50%;
	filter: blur(32px);
}

.banner-glow-2 {
	position: absolute;
	bottom: -32px;
	left: 33%;
	width: 128px;
	height: 128px;
	background: rgba(99, 102, 241, 0.1);
	border-radius: 50%;
	filter: blur(40px);
}

.banner-level-tag {
	position: absolute;
	bottom: 12px;
	right: 16px;
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	font-weight: var(--font-bold);
	text-transform: uppercase;
	letter-spacing: var(--tracking-wider);
	padding: 4px 12px;
	background: rgba(10, 10, 10, 0.6);
	color: #f59e0b;
	border: 1px solid rgba(245, 158, 11, 0.2);
	border-radius: 6px;
	backdrop-filter: blur(6px);
}

.logout-btn {
	position: absolute;
	top: 12px;
	left: 16px;
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	font-weight: var(--font-bold);
	text-transform: uppercase;
	letter-spacing: var(--tracking-wider);
	padding: 4px 12px;
	background: rgba(10, 10, 10, 0.6);
	color: #d1d5db;
	border: 1px solid rgba(255, 255, 255, 0.15);
	border-radius: 6px;
	cursor: pointer;
	backdrop-filter: blur(6px);
	transition:
		color 0.15s ease,
		border-color 0.15s ease;
}

.logout-btn:hover {
	color: #ffffff;
	border-color: rgba(255, 255, 255, 0.35);
}

.profile-body {
	padding: 8px 24px 24px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

@media (min-width: 640px) {
	.profile-body {
		flex-direction: row;
		align-items: flex-end;
	}
}

.profile-avatar-wrap {
	position: relative;
	margin-top: -56px;
	flex-shrink: 0;
}

@media (min-width: 640px) {
	.profile-avatar-wrap {
		margin-top: -72px;
	}
}

.profile-avatar-img {
	border: 4px solid var(--page-bg);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

@media (min-width: 640px) {
	.profile-avatar-img {
		width: 128px;
		height: 128px;
	}
}

.online-dot {
	position: absolute;
	bottom: 4px;
	right: 4px;
	width: 16px;
	height: 16px;
	background: #10b981;
	border: 2px solid var(--page-bg);
	border-radius: 50%;
	animation: pulse-dot 2s ease-in-out infinite;
}

.profile-info {
	flex-grow: 1;
	min-width: 0;
	padding-bottom: 4px;
}

.profile-name-row {
	display: flex;
	align-items: center;
	gap: 10px;
	flex-wrap: wrap;
	margin-bottom: 8px;
}

.profile-name {
	font-size: 1.4rem;
	font-weight: var(--font-extrabold);
	letter-spacing: var(--tracking-tight);
	color: var(--text-primary);
	margin: 0;
}

.gamertag {
	font-family: var(--font-mono);
	font-size: var(--text-xs);
	font-weight: var(--font-semibold);
	padding: 3px 8px;
	border-radius: 6px;
	background: var(--surface-elevated-border);
	color: var(--text-muted);
}

.rank-badge {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	font-weight: var(--font-bold);
	padding: 3px 8px;
	border-radius: 9999px;
	background: rgba(2, 44, 22, 0.5);
	color: #34d399;
	border: 1px solid rgba(16, 185, 129, 0.2);
}

.rank-icon {
	width: 12px;
	height: 12px;
	flex-shrink: 0;
}

.profile-bio {
	font-size: var(--text-base);
	color: var(--text-secondary);
	line-height: var(--leading-relaxed);
	margin: 0 0 12px;
	max-width: 60ch;
}

.profile-meta {
	display: flex;
	align-items: center;
	gap: 16px;
	font-family: var(--font-mono);
	font-size: var(--text-xs);
	color: var(--text-muted);
	padding-top: 12px;
	border-top: 1px solid var(--surface-elevated-border);
	flex-wrap: wrap;
}

.profile-meta span {
	display: inline-flex;
	align-items: center;
	gap: 4px;
}

.meta-icon {
	width: 12px;
	height: 12px;
	flex-shrink: 0;
}

@keyframes pulse-dot {
	0%,
	100% {
		box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
	}

	50% {
		box-shadow: 0 0 0 4px rgba(16, 185, 129, 0);
	}
}
</style>
