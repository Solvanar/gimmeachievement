<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAchievementsStore } from '@/stores/achievements';
import {
	ACHIEVEMENT_THEMES,
	ACHIEVEMENT_THEME_LABELS,
	type AchievementTheme,
} from '@/constants/achievementThemes';
import AchievementCard from '@/components/AchievementCard.vue';
import AddAchievementModal from '@/components/AddAchievementModal.vue';
import UiButton from '@/components/ui/UiButton.vue';
import UiChip from '@/components/ui/UiChip.vue';
import UiSpinner from '@/components/ui/UiSpinner.vue';
import { pluralize, ACHIEVEMENT_FORMS } from '@/composables/usePlural';

type FilterValue = AchievementTheme | 'all';

const store = useAchievementsStore();
const selectedFilter = ref<FilterValue>('all');
const showAddModal = ref(false);

onMounted(() => store.fetchAll());

const themeCounts = computed(() => {
	const counts = {} as Record<AchievementTheme, number>;
	for (const theme of Object.values(ACHIEVEMENT_THEMES)) counts[theme] = 0;
	for (const achievement of store.achievements) counts[achievement.theme]++;
	return counts;
});

const filterOptions = computed<
	Array<{ value: FilterValue; label: string; count: number }>
>(() => [
	{ value: 'all', label: 'Все', count: store.achievements.length },
	...Object.values(ACHIEVEMENT_THEMES)
		.filter((theme) => themeCounts.value[theme] > 0)
		.map((theme) => ({
			value: theme,
			label: ACHIEVEMENT_THEME_LABELS[theme],
			count: themeCounts.value[theme],
		})),
]);

const filteredAchievements = computed(() =>
	selectedFilter.value === 'all'
		? store.achievements
		: store.achievements.filter(
				(achievement) => achievement.theme === selectedFilter.value,
			),
);

function onSubmitCode(code: string) {
	console.log('Registering achievement with code:', code);
	showAddModal.value = false;
}
</script>

<template>
	<div class="catalog-page">
		<header class="catalog-header">
			<div class="header-text">
				<h1>Каталог</h1>
				<p v-if="store.achievements.length > 0" class="subtitle">
					{{ pluralize(store.achievements.length, ACHIEVEMENT_FORMS) }} в
					коллекции
				</p>
				<p v-else class="subtitle">Все достижения, что у нас есть</p>
			</div>

			<UiButton variant="primary" size="md" @click="showAddModal = true">
				<template #prefix>
					<span class="add-icon" aria-hidden="true">+</span>
				</template>
				Добавить ачивку
			</UiButton>
		</header>

		<nav
			v-if="!store.loading && !store.error"
			class="filters"
			aria-label="Категории"
		>
			<UiChip
				v-for="opt in filterOptions"
				:key="opt.value"
				:active="selectedFilter === opt.value"
				:count="opt.count"
				@click="selectedFilter = opt.value"
			>
				{{ opt.label }}
			</UiChip>
		</nav>

		<div v-if="store.loading" class="state-msg">
			<UiSpinner size="lg" />
		</div>
		<p v-else-if="store.error" class="state-msg state-error">
			{{ store.error }}
		</p>
		<p v-else-if="filteredAchievements.length === 0" class="state-msg">
			В этой категории пока ничего нет
		</p>

		<div v-else class="cards-grid">
			<div
				v-for="achievement in filteredAchievements"
				:key="achievement.id"
				class="card-cell"
			>
				<AchievementCard :achievement="achievement" />
			</div>
		</div>

		<AddAchievementModal
			v-if="showAddModal"
			@close="showAddModal = false"
			@submit="onSubmitCode"
		/>
	</div>
</template>

<style scoped>
.catalog-page {
	max-width: 1280px;
	margin: 0 auto;
	padding: 40px 24px 80px;
}

/* ── Header ── */
.catalog-header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 24px;
	padding-bottom: 20px;
	margin-bottom: 24px;
	border-bottom: 1px solid var(--surface-elevated-border);
}

.header-text h1 {
	font-size: clamp(1.8rem, 4vw, 2.4rem);
	font-weight: 800;
	letter-spacing: -0.02em;
	margin: 0 0 4px;
	background: linear-gradient(
		135deg,
		var(--hero-text-from) 0%,
		var(--hero-text-to) 100%
	);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.subtitle {
	color: var(--text-muted);
	font-size: 0.78rem;
	letter-spacing: 0.08em;
	text-transform: uppercase;
	margin: 0;
}

.add-icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: var(--page-bg);
	color: var(--text-primary);
	font-size: 0.95rem;
	font-weight: 700;
	line-height: 1;
}

/* ── Filters ── */
.filters {
	display: inline-flex;
	flex-wrap: wrap;
	gap: 4px;
	padding: 4px;
	margin-bottom: 28px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 999px;
	width: max-content;
	max-width: 100%;
}

/* ── State ── */
.state-msg {
	color: var(--text-muted);
	font-size: 0.95rem;
	text-align: center;
	padding: 40px 0;
}
.state-error {
	color: var(--text-error);
}

/* ── Grid ── */
.cards-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
	gap: 20px;
}

/* ── Cell ── */
.card-cell {
	padding: 22px 36px 24px 18px;
	background: var(--surface-elevated);
	border: 1px solid var(--surface-elevated-border);
	border-radius: 22px;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease,
		background 0.2s ease;
}

.card-cell:hover {
	border-color: var(--btn-border-hover);
	box-shadow:
		inset 0 0 0 1px var(--surface-elevated-border),
		0 8px 28px var(--shadow-card);
}

@media (max-width: 720px) {
	.catalog-page {
		padding: 24px 16px 60px;
	}
	.catalog-header {
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}
	.cards-grid {
		grid-template-columns: 1fr;
	}
	.card-cell {
		padding: 18px 32px 20px 14px;
	}
}
</style>
