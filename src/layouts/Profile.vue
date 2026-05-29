<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAchievementsStore } from '@/stores/achievements';
import { useProfileStore } from '@/stores/profile';
import {
	ACHIEVEMENT_THEMES,
	ACHIEVEMENT_THEME_LABELS,
	type AchievementTheme,
} from '@/constants/achievementThemes';
import PHeader from '@/components/profile/PHeader.vue';
import PGamerscore from '@/components/profile/PGamerscore.vue';
import PFilters from '@/components/profile/PFilters.vue';
import PCatalog from '@/components/profile/PCatalog.vue';
import PSidebar from '@/components/profile/PSidebar.vue';

type FilterValue = AchievementTheme | 'all';
type StatusFilter = 'all' | 'unlocked' | 'locked';

const store = useAchievementsStore();
const profileStore = useProfileStore();

onMounted(() => store.fetchAll());

const statusFilter = ref<StatusFilter>('all');
const themeFilter = ref<FilterValue>('all');

const totalPointsAvailable = computed(() =>
	store.achievements.reduce((sum, ach) => sum + (ach.points ?? 0), 0),
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

const themeOptions = computed<Array<{ value: FilterValue; label: string }>>(
	() => [
		{ value: 'all', label: 'Любой' },
		...Object.values(ACHIEVEMENT_THEMES).map((theme) => ({
			value: theme,
			label: ACHIEVEMENT_THEME_LABELS[theme],
		})),
	],
);
</script>

<template>
	<div class="profile-page">
		<div class="profile-grid">
			<div class="profile-main">
				<PHeader
					:profile="profileStore.profile"
					:level="level"
					:unlocked-count="store.unlockedCount"
				/>
				<PGamerscore
					:total-points="store.totalPoints"
					:total-points-available="totalPointsAvailable"
					:progress-percent="progressPercent"
					:level="level"
					:unlock-percent="unlockPercent"
				/>
				<PFilters
					v-model:status-filter="statusFilter"
					v-model:theme-filter="themeFilter"
					:total-count="store.achievements.length"
					:unlocked-count="store.unlockedCount"
					:theme-options="themeOptions"
				/>
				<PCatalog :achievements="filteredAchievements" />
			</div>

			<PSidebar />
		</div>
	</div>
</template>

<style scoped>
.profile-page {
	max-width: 1200px;
	margin: 0 auto;
	padding: 32px 24px 80px;
}

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
</style>
