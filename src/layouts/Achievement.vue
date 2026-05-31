<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAchievementsStore } from '@/stores/achievements';
import { useProfileStore } from '@/stores/profile';
import { useRouter } from 'vue-router';
import CommentsSection from '@/components/CommentsSection.vue';
import ACard from '@/components/achievement/ACard.vue';
import AHeader from '@/components/achievement/AHeader.vue';
import AStory from '@/components/achievement/AStory.vue';
import AReactions from '@/components/achievement/AReactions.vue';
import { THEME_ACCENT_COLORS } from '@/constants/themeAccents';

const props = defineProps<{ id: string }>();
const store = useAchievementsStore();
const profileStore = useProfileStore();
const router = useRouter();

const achievement = computed(() => store.getById(props.id));
const comments = computed(() => store.getComments(props.id));

onMounted(() => store.fetchOne(props.id));

function addComment(text: string) {
	store.addComment(
		props.id,
		text,
		profileStore.profile.username,
		profileStore.profile.avatar,
	);
}
</script>

<template>
	<div
		v-if="achievement"
		class="detail-page"
		:class="`bg-theme-${achievement.theme}`"
	>
		<div class="theme-bg" :class="`theme-bg-${achievement.theme}`">
			<div v-if="achievement.theme === 'gaming'" class="gaming-grid" />
			<div v-if="achievement.theme === 'retro'" class="retro-grid" />
			<div v-if="achievement.theme === 'retro'" class="retro-scanlines" />
			<div class="theme-radial" />
		</div>

		<AHeader />

		<main class="detail-main">
			<div class="category-tag-wrap">
				<span class="category-tag">
					{{ (achievement.category ?? achievement.theme).toUpperCase() }} //
					ACHIEVEMENT CARD
				</span>
			</div>
			<div class="large-card-wrap">
				<ACard :achievement="achievement" size="large" :interactive="false" />
			</div>
			<AStory :achievement="achievement" />
			<AReactions />
			<CommentsSection
				:comments="comments"
				:accent-color="THEME_ACCENT_COLORS[achievement.theme] ?? '#10b981'"
				:theme-type="achievement.theme"
				@add-comment="addComment"
			/>
			<footer class="detail-footer">
				<span v-if="achievement.code">
					LIFE ACHIEVEMENTS ID // {{ achievement.code }}
				</span>
				<span
					>ЦЕНИТЕ МОМЕНТЫ И СОБИРАЙТЕ СВОЮ КОЛЛЕКЦИЮ ЗНАЧКОВ С КАЖДОЙ
					ПОБЕДЫ</span
				>
			</footer>
		</main>
	</div>

	<div v-else class="not-found">
		<p>Такой ачивки нет</p>
		<button class="back-btn" @click="router.push('/profile')">
			← Вернуться
		</button>
	</div>
</template>

<style scoped>
.detail-page {
	position: relative;
	min-height: 100vh;
	color: #e5e7eb;
	padding-bottom: 80px;
}

/* ── Theme backgrounds ── */
.theme-bg {
	position: fixed;
	inset: 0;
	pointer-events: none;
	z-index: 0;
}

.theme-bg-gaming {
	background: var(--gaming-page-bg);
}
.theme-bg-retro {
	background: var(--retro-page-bg);
}
.theme-bg-cozy {
	background: var(--cozy-page-bg);
}
.theme-bg-forest {
	background: var(--forest-page-bg);
}
.theme-bg-default {
	background: var(--page-bg);
}

.gaming-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(var(--gaming-page-grid) 1px, transparent 1px),
		linear-gradient(90deg, var(--gaming-page-grid) 1px, transparent 1px);
	background-size: 40px 40px;
}

.retro-grid {
	position: absolute;
	inset: 0;
	background-image:
		linear-gradient(rgba(99, 102, 241, 0.06) 1.5px, transparent 1.5px),
		linear-gradient(90deg, rgba(99, 102, 241, 0.06) 1.5px, transparent 1.5px);
	background-size: 32px 32px;
}

.retro-scanlines {
	position: absolute;
	inset: 0;
	background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
	background-size: 100% 4px;
	z-index: 50;
	opacity: 0.3;
	pointer-events: none;
}

.theme-radial {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 600px;
	height: 600px;
	border-radius: 50%;
	filter: blur(100px);
	pointer-events: none;
}

.bg-theme-gaming .theme-radial {
	background: rgba(16, 185, 129, 0.05);
}
.bg-theme-retro .theme-radial {
	background: rgba(99, 102, 241, 0.06);
}
.bg-theme-cozy .theme-radial {
	background: rgba(245, 158, 11, 0.05);
}
.bg-theme-forest .theme-radial {
	background: rgba(16, 185, 129, 0.05);
}
.bg-theme-default .theme-radial {
	background: transparent;
}

/* ── Main content ── */
.detail-main {
	position: relative;
	max-width: 860px;
	margin: 0 auto;
	padding: 0 24px;
	z-index: 20;
}

/* ── Card section ── */
.category-tag-wrap {
	text-align: center;
	margin-bottom: 24px;
}

.category-tag {
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	text-transform: uppercase;
	letter-spacing: 0.12em;
	padding: 5px 14px;
	background: rgba(255, 255, 255, 0.05);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 9999px;
	color: rgba(255, 255, 255, 0.6);
}

.large-card-wrap {
	display: flex;
	justify-content: center;
	margin-bottom: 32px;
}

/* ── Footer ── */
.detail-footer {
	margin-top: 48px;
	text-align: center;
	font-family: var(--font-mono);
	font-size: var(--text-2xs);
	color: #374151;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

/* ── Not found ── */
.not-found {
	display: grid;
	place-content: center;
	min-height: 100vh;
	gap: 16px;
	text-align: center;
	color: var(--text-muted);
}

.back-btn {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	background: rgba(23, 23, 23, 0.6);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 12px;
	color: #9ca3af;
	font-size: var(--text-base);
	cursor: pointer;
	transition:
		color 0.15s ease,
		border-color 0.15s ease;
}

.back-btn:hover {
	color: #ffffff;
	border-color: rgba(255, 255, 255, 0.2);
}
</style>
