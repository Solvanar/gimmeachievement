<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAchievementsStore } from '@/stores/achievements';
import { useProfileStore } from '@/stores/profile';
import { ACHIEVEMENT_THEMES, ACHIEVEMENT_THEME_LABELS, type AchievementTheme } from '@/constants/achievementThemes';
import AchievementCard from '@/components/AchievementCard.vue';
import RegisterCode from '@/components/RegisterCode.vue';

type FilterValue = AchievementTheme | 'all';
type StatusFilter = 'all' | 'unlocked' | 'locked';

const store = useAchievementsStore();
const profileStore = useProfileStore();
const router = useRouter();

onMounted(() => store.fetchAll());

const statusFilter = ref<StatusFilter>('all');
const themeFilter = ref<FilterValue>('all');

const totalPointsAvailable = computed(() =>
	store.achievements.reduce((acc, a) => acc + (a.points ?? 0), 0),
);

const level = computed(() => Math.floor(store.totalPoints / 100) + 1);

const progressPercent = computed(() =>
	totalPointsAvailable.value > 0
		? (store.totalPoints / totalPointsAvailable.value) * 100
		: 0,
);

const unlockPercent = computed(() =>
	store.achievements.length > 0
		? Math.round((store.unlockedCount / store.achievements.length) * 100)
		: 0,
);

const filteredAchievements = computed(() =>
	store.achievements.filter((ach) => {
		if (statusFilter.value === 'unlocked' && !ach.unlocked) return false;
		if (statusFilter.value === 'locked' && ach.unlocked) return false;
		if (themeFilter.value !== 'all' && ach.theme !== themeFilter.value) return false;
		return true;
	}),
);

const themeOptions = computed<Array<{ value: FilterValue; label: string }>>(() => [
	{ value: 'all', label: 'Любой' },
	...Object.values(ACHIEVEMENT_THEMES).map((theme) => ({
		value: theme,
		label: ACHIEVEMENT_THEME_LABELS[theme],
	})),
]);

function openAchievement(id: string) {
	router.push(`/achievement/${id}`);
}
</script>

<template>
	<div class="profile-page">
		<!-- Two-column layout -->
		<div class="profile-grid">
			<!-- Left: Profile + Achievement list -->
			<div class="profile-main">

				<!-- Profile Header Card -->
				<div class="profile-card">
					<div class="profile-banner">
						<div class="banner-grid" />
						<div class="banner-glow-1" />
						<div class="banner-glow-2" />
						<span class="banner-level-tag">
							LVL {{ level }} ACHIEVEMENT HUNTER
						</span>
					</div>

					<div class="profile-body">
						<div class="profile-avatar-wrap">
							<img
								:src="profileStore.profile.avatar"
								:alt="profileStore.profile.username"
								referrerpolicy="no-referrer"
								class="profile-avatar"
							/>
							<span class="online-dot" />
						</div>

						<div class="profile-info">
							<div class="profile-name-row">
								<h2 class="profile-name">{{ profileStore.profile.username }}</h2>
								<span class="gamertag">@{{ profileStore.profile.gamerTag }}</span>
								<span class="rank-badge">
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
										<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" fill="none" />
									</svg>
									{{ profileStore.profile.rank }}
								</span>
							</div>
							<p class="profile-bio">{{ profileStore.profile.bio }}</p>
							<div class="profile-meta">
								<span>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
										<rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none" />
										<line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" />
										<line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" />
										<line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" />
									</svg>
									Зарегистрирован: {{ profileStore.profile.joinDate }}
								</span>
								<span>
									<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
										<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none" />
									</svg>
									{{ store.unlockedCount }} ачивок получено
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Gamerscore Bar -->
				<div class="gamerscore-card">
					<div class="gamerscore-header">
						<div class="gamerscore-label">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="8" r="7" stroke="#f59e0b" stroke-width="2" fill="none" />
								<path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
							ПРОГРЕСС И ГЕЙМЕРСКОР
						</div>
						<div class="gamerscore-score">
							<span class="score-current">{{ store.totalPoints }}G</span>
							<span class="score-total">/ {{ totalPointsAvailable }}G</span>
						</div>
					</div>
					<div class="progress-track">
						<div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
					</div>
					<div class="gamerscore-footer">
						<span>Уровень {{ level }} Hunter</span>
						<span>{{ unlockPercent }}% ачивок разблокировано</span>
					</div>
				</div>

				<!-- Filters -->
				<div class="filters-section">
					<div class="filters-row">
						<!-- Status filter -->
						<div class="filter-group">
							<button
								class="filter-btn"
								:class="{ active: statusFilter === 'all' }"
								@click="statusFilter = 'all'"
							>
								Все ({{ store.achievements.length }})
							</button>
							<button
								class="filter-btn"
								:class="{ active: statusFilter === 'unlocked' }"
								@click="statusFilter = 'unlocked'"
							>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
									<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#34d399" stroke-width="2" stroke-linecap="round" />
									<polyline points="22 4 12 14.01 9 11.01" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
								Полученные ({{ store.unlockedCount }})
							</button>
							<button
								class="filter-btn"
								:class="{ active: statusFilter === 'locked' }"
								@click="statusFilter = 'locked'"
							>
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#fb7185" stroke-width="2" fill="none" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#fb7185" stroke-width="2" stroke-linecap="round" />
								</svg>
								Закрытые ({{ store.achievements.length - store.unlockedCount }})
							</button>
						</div>

						<!-- Category/theme filter -->
						<div class="theme-filter">
							<span class="theme-filter-label">
								<svg width="11" height="11" viewBox="0 0 24 24" fill="none">
									<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" stroke-width="2" fill="none" />
								</svg>
								Вайб:
							</span>
							<button
								v-for="opt in themeOptions"
								:key="opt.value"
								class="theme-chip"
								:class="{ active: themeFilter === opt.value }"
								@click="themeFilter = opt.value"
							>
								{{ opt.label }}
							</button>
						</div>
					</div>

					<!-- Info hint -->
					<div class="info-hint">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="info-icon">
							<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
							<line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
							<line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						</svg>
						<p>
							Нажмите на любую <strong>полученную ачивку</strong> ниже, чтобы открыть её кастомную страницу с уникальным дизайном, историей получения и реакциями!
						</p>
					</div>
				</div>

				<!-- Achievement List -->
				<div class="achievement-list">
					<div v-if="filteredAchievements.length === 0" class="empty-state">
						<span class="empty-icon">👀</span>
						<p>Нет ачивок, подходящих под выбранные фильтры.</p>
					</div>
					<div
						v-for="ach in filteredAchievements"
						:key="ach.id"
						class="achievement-cell"
						@click="openAchievement(ach.id)"
					>
						<AchievementCard :achievement="ach" :interactive="false" />
					</div>
				</div>

			</div>

			<!-- Right: Sidebar -->
			<div class="profile-sidebar">
				<RegisterCode />

				<div class="concept-card">
					<h4 class="concept-title">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
							<rect x="2" y="7" width="20" height="14" rx="2" ry="2" stroke="#34d399" stroke-width="2" fill="none" />
							<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="#34d399" stroke-width="2" />
						</svg>
						Концепция Проекта
					</h4>
					<p>
						Я создаю реальные, стильные <strong>металлические значки и магниты</strong> в виде ачивок! У каждого значка геймерский дизайн и напечатанный индивидуальный код на обратной стороне.
					</p>
					<p>
						Зарегистрировав код тут, вы заводите цифровую карту ачивки, которая полностью меняет тему страницы под атмосферу самого значка!
					</p>
					<RouterLink to="/shop" class="shop-link">
						Посмотреть каталог &amp; заказать значки 🛒
					</RouterLink>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.profile-page {
	max-width: 1200px;
	margin: 0 auto;
	padding: 32px 24px 80px;
}

/* ── Grid layout ── */
.profile-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 32px;
	align-items: start;
}

@media (min-width: 1024px) {
	.profile-grid {
		grid-template-columns: 1fr 340px;
	}
}

.profile-main {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

/* ── Profile Card ── */
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
	font-family: monospace;
	font-size: 0.62rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	padding: 4px 12px;
	background: rgba(10, 10, 10, 0.6);
	color: #f59e0b;
	border: 1px solid rgba(245, 158, 11, 0.2);
	border-radius: 6px;
	backdrop-filter: blur(6px);
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

.profile-avatar {
	width: 112px;
	height: 112px;
	border-radius: 20px;
	object-fit: cover;
	border: 4px solid var(--page-bg);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

@media (min-width: 640px) {
	.profile-avatar {
		width: 128px;
		height: 128px;
		margin-top: -72px;
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
	font-weight: 800;
	letter-spacing: -0.02em;
	color: var(--text-primary);
	margin: 0;
}

.gamertag {
	font-family: monospace;
	font-size: 0.72rem;
	font-weight: 600;
	padding: 3px 8px;
	border-radius: 6px;
	background: var(--surface-elevated-border);
	color: var(--text-muted);
}

.rank-badge {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-family: monospace;
	font-size: 0.68rem;
	font-weight: 700;
	padding: 3px 8px;
	border-radius: 9999px;
	background: rgba(2, 44, 22, 0.5);
	color: #34d399;
	border: 1px solid rgba(16, 185, 129, 0.2);
}

.profile-bio {
	font-size: 0.85rem;
	color: var(--text-secondary);
	line-height: 1.6;
	margin: 0 0 12px;
	max-width: 60ch;
}

.profile-meta {
	display: flex;
	align-items: center;
	gap: 16px;
	font-family: monospace;
	font-size: 0.7rem;
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

/* ── Gamerscore card ── */
.gamerscore-card {
	padding: 20px 24px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 20px;
	box-shadow: var(--shadow-card);
}

.gamerscore-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 12px;
}

.gamerscore-label {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	font-family: monospace;
	font-size: 0.7rem;
	font-weight: 700;
	color: var(--text-muted);
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.gamerscore-score {
	font-family: monospace;
	font-size: 0.85rem;
}

.score-current {
	font-weight: 800;
	color: #f59e0b;
}

.score-total {
	color: var(--text-muted);
}

.progress-track {
	width: 100%;
	height: 10px;
	background: var(--input-bg);
	border: 1px solid var(--input-border);
	border-radius: 9999px;
	overflow: hidden;
	padding: 2px;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(to right, #14b8a6, #10b981, #6366f1);
	border-radius: 9999px;
	transition: width 1s ease;
	min-width: 4px;
}

.gamerscore-footer {
	display: flex;
	justify-content: space-between;
	font-family: monospace;
	font-size: 0.65rem;
	color: var(--text-muted);
	margin-top: 8px;
}

/* ── Filters ── */
.filters-section {
	display: flex;
	flex-direction: column;
	gap: 14px;
}

.filters-row {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

@media (min-width: 768px) {
	.filters-row {
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
}

.filter-group {
	display: inline-flex;
	align-items: center;
	gap: 2px;
	padding: 4px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 12px;
}

.filter-btn {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	padding: 6px 12px;
	font-size: 0.75rem;
	font-weight: 600;
	border-radius: 8px;
	border: none;
	background: transparent;
	color: var(--text-muted);
	cursor: pointer;
	transition:
		background 0.15s ease,
		color 0.15s ease;
	white-space: nowrap;
}

.filter-btn:hover {
	color: var(--text-primary);
}

.filter-btn.active {
	background: #4338ca;
	color: #ffffff;
}

.theme-filter {
	display: flex;
	align-items: center;
	gap: 6px;
	flex-wrap: wrap;
}

.theme-filter-label {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	font-family: monospace;
	font-size: 0.65rem;
	font-weight: 600;
	text-transform: uppercase;
	color: var(--text-muted);
}

.theme-chip {
	padding: 5px 10px;
	font-size: 0.72rem;
	font-weight: 600;
	border-radius: 8px;
	border: 1px solid transparent;
	background: transparent;
	color: var(--text-muted);
	cursor: pointer;
	transition:
		background 0.15s ease,
		border-color 0.15s ease,
		color 0.15s ease;
}

.theme-chip:hover {
	color: var(--text-primary);
}

.theme-chip.active {
	background: var(--surface-elevated);
	border-color: var(--surface-elevated-border);
	color: var(--text-primary);
}

.info-hint {
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 12px 14px;
	background: rgba(30, 27, 75, 0.2);
	border: 1px solid rgba(99, 102, 241, 0.2);
	border-radius: 14px;
	font-size: 0.78rem;
	color: #a5b4fc;
	line-height: 1.5;
}

.info-icon {
	flex-shrink: 0;
	margin-top: 1px;
	color: #818cf8;
}

.info-hint p {
	margin: 0;
}

/* ── Achievement list ── */
.achievement-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.achievement-cell {
	cursor: pointer;
}

.empty-state {
	padding: 48px 24px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 20px;
	text-align: center;
}

.empty-icon {
	font-size: 2rem;
}

.empty-state p {
	margin: 8px 0 0;
	color: var(--text-muted);
	font-size: 0.9rem;
}

/* ── Sidebar ── */
.profile-sidebar {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

@media (min-width: 1024px) {
	.profile-sidebar {
		position: sticky;
		top: 80px;
	}
}

.concept-card {
	padding: 22px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 24px;
	box-shadow: var(--shadow-card);
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.concept-title {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 0.88rem;
	font-weight: 700;
	color: var(--text-primary);
	margin: 0;
}

.concept-card p {
	font-size: 0.78rem;
	color: var(--text-secondary);
	line-height: 1.6;
	margin: 0;
}

.shop-link {
	display: block;
	text-align: center;
	padding: 10px;
	background: rgba(2, 44, 22, 0.2);
	border: 1px solid rgba(16, 185, 129, 0.2);
	border-radius: 12px;
	color: #34d399;
	font-size: 0.78rem;
	font-weight: 700;
	text-decoration: none;
	transition:
		background 0.15s ease,
		border-color 0.15s ease;
}

.shop-link:hover {
	background: rgba(2, 44, 22, 0.35);
	border-color: rgba(16, 185, 129, 0.4);
}

/* ── Animations ── */
@keyframes pulse-dot {
	0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
	50% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
}
</style>
