import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Achievement } from '@/types/achievement';
import { fetchAchievement, fetchAchievements } from '@/services/achievements';
import { useNotifier } from '@/composables/useNotifier';

const FETCH_ERROR_MESSAGE = 'Не удалось загрузить ачивки';

export const useAchievementsStore = defineStore('achievements', () => {
	const achievements = ref<Achievement[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const { notifyError } = useNotifier();

	const getById = computed(
		() => (id: string) =>
			achievements.value.find((achievement) => achievement.id === id),
	);

	function handleError(err: unknown) {
		error.value = err instanceof Error ? err.message : FETCH_ERROR_MESSAGE;

		notifyError(FETCH_ERROR_MESSAGE);
	}

	async function fetchAll() {
		loading.value = true;
		error.value = null;

		try {
			achievements.value = await fetchAchievements();
		} catch (err) {
			handleError(err);
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
			handleError(err);
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
