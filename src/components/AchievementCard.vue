<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Achievement } from '@/types/achievement';
import { ACHIEVEMENT_THEMES } from '@/constants/achievementThemes';
import GamingDecor from '@/components/decor/GamingDecor.vue';

const props = defineProps<{ achievement: Achievement }>();
const router = useRouter();

function onClick() {
	router.push(`/achievement/${props.achievement.id}`);
}
</script>

<template>
	<div class="card-wrapper" @click="onClick">
		<div class="card-scene">
			<div class="card" :class="`theme-${achievement.theme}`">
				<div class="theme-decor" />
				<div class="card-content">
					<div class="card-image-slot">
						<img
							v-if="achievement.imageUrl"
							:src="achievement.imageUrl"
							:alt="achievement.title"
						/>
						<div v-else class="card-image-placeholder"><span>✦</span></div>
					</div>
					<div class="card-text">
						<h3>{{ achievement.title }}</h3>
						<p>{{ achievement.description }}</p>
					</div>
				</div>
			</div>

			<GamingDecor
				v-if="achievement.theme === ACHIEVEMENT_THEMES.GAMING"
				variant="card"
			/>
		</div>
	</div>
</template>

<style scoped>
.card-wrapper {
	cursor: pointer;
	display: flex;
	justify-content: center;
	width: 100%;
}

.card-scene {
	position: relative;
	width: 320px;
	height: 110px;
	flex-shrink: 0;
}

.card {
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 55px;
	overflow: hidden;
	box-shadow: var(--shadow-card);
	transition: box-shadow 0.2s ease;
}

.card:hover {
	box-shadow: var(--shadow-card-hover);
}

.card-content {
	position: relative;
	z-index: 5;
	display: flex;
	align-items: center;
	gap: 14px;
	height: 100%;
	padding: 0 22px 0 16px;
}

.card-image-slot {
	flex-shrink: 0;
	width: 74px;
	height: 74px;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

.card-image-slot img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.card-image-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.75rem;
}

.card-text h3 {
	margin: 0 0 4px;
	font-size: 0.95rem;
	font-weight: 700;
	line-height: 1.2;
}

.card-text p {
	margin: 0;
	font-size: 0.75rem;
	line-height: 1.4;
	opacity: 0.8;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.theme-decor {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 1;
	border-radius: inherit;
}

/* ══ THEME: gaming ══ */
.theme-gaming {
	background: var(--gaming-card-bg);
	border: 1px solid var(--gaming-card-border);
	color: var(--gaming-card-text);
}
.theme-gaming .card-image-placeholder {
	background: var(--gaming-image-bg);
	color: var(--gaming-image-icon);
	border: 2px solid var(--gaming-image-border);
}
.theme-gaming .card-text h3 {
	color: var(--gaming-card-title);
	text-shadow: 0 0 12px var(--gaming-card-title-glow);
}
.theme-gaming .theme-decor {
	background: var(--gaming-decor-overlay);
}

/* ══ THEME: cooking ══ */
.theme-cooking {
	background: var(--cooking-card-bg);
	border: 2px solid var(--cooking-card-border);
	color: var(--cooking-card-text);
}
.theme-cooking .card-image-placeholder {
	background: var(--cooking-image-bg);
	color: var(--cooking-image-icon);
	border: 2px solid var(--cooking-image-border);
	box-shadow: var(--cooking-image-shadow);
}
.theme-cooking .card-text h3 {
	color: var(--cooking-card-title);
	text-shadow: var(--cooking-card-title-shadow);
	font-family: Georgia, serif;
}
.theme-cooking .card-text p {
	color: var(--cooking-card-text-secondary);
}
.theme-cooking .theme-decor {
	box-shadow: var(--cooking-card-inset);
}

/* ══ THEME: default ══ */
.theme-default {
	background: var(--default-card-bg);
	border: 1px solid var(--default-card-border);
	color: var(--default-card-text);
}
.theme-default .card-image-placeholder {
	background: var(--default-image-bg);
	color: var(--default-image-icon);
	border: 1px solid var(--default-image-border);
}
</style>
