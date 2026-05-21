import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Achievement } from '@/types/achievement';
import { fetchAchievements, fetchAchievement } from '@/services/achievements';

export const useAchievementsStore = defineStore('achievements', () => {
	const achievements = ref<Achievement[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const getById = computed(
		() => (id: string) =>
			achievements.value.find((achievement) => achievement.id === id),
	);

	async function fetchAll() {
		loading.value = true;
		error.value = null;
		try {
			achievements.value = await fetchAchievements();
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Ошибка загрузки';
		} finally {
			loading.value = false;
		}
	}

	async function fetchOne(id: string) {
		if (getById.value(id)) return;
		try {
			const achievement = await fetchAchievement(id);
			achievements.value.push(achievement);
		} catch (err) {
			error.value = err instanceof Error ? err.message : 'Ошибка загрузки';
		}
	}

	function updateNote(id: string, note: string) {
		const achievement = achievements.value.find((item) => item.id === id);
		if (achievement) achievement.personalNote = note;
	}

	return {
		achievements,
		loading,
		error,
		getById,
		fetchAll,
		fetchOne,
		updateNote,
	};
});
