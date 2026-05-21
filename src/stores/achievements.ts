import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Achievement } from '@/types/achievement';
import { fetchAchievements, fetchAchievement } from '@/services/achievements';

export const useAchievementsStore = defineStore('achievements', () => {
	const achievements = ref<Achievement[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const getById = computed(
		() => (id: string) => achievements.value.find((a) => a.id === id),
	);

	async function fetchAll() {
		loading.value = true;
		error.value = null;
		try {
			achievements.value = await fetchAchievements();
		} catch (e) {
			error.value = e instanceof Error ? e.message : 'Ошибка загрузки';
		} finally {
			loading.value = false;
		}
	}

	async function fetchOne(id: string) {
		if (getById.value(id)) return;
		try {
			const a = await fetchAchievement(id);
			achievements.value.push(a);
		} catch (e) {
			error.value = e instanceof Error ? e.message : 'Ошибка загрузки';
		}
	}

	function updateNote(id: string, note: string) {
		const a = achievements.value.find((a) => a.id === id);
		if (a) a.personalNote = note;
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
