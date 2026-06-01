import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Achievement } from '@/types/achievement';
import {
	fetchAchievements,
	fetchAchievement,
	activateCode as apiActivateCode,
	updateNote as apiUpdateNote,
} from '@/services/achievements';
import { useNotifier } from '@/composables/useNotifier';

export const useAchievementsStore = defineStore('achievements', () => {
	const achievements = ref<Achievement[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const { notifyError } = useNotifier();

	const getById = computed(
		() => (id: string) => achievements.value.find((item) => item.id === id),
	);

	const totalPoints = computed(() =>
		achievements.value
			.filter((item) => item.unlocked)
			.reduce((sum, item) => sum + item.points, 0),
	);

	const unlockedCount = computed(
		() => achievements.value.filter((item) => item.unlocked).length,
	);

	function handleError(err: unknown) {
		error.value = err instanceof Error ? err.message : 'Что-то пошло не так';
		notifyError(error.value);
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

		loading.value = true;
		error.value = null;

		try {
			const achievement = await fetchAchievement(id);
			achievements.value.push(achievement);
		} catch (err) {
			handleError(err);
		} finally {
			loading.value = false;
		}
	}

	async function activateCode(code: string): Promise<Achievement> {
		const unlocked = await apiActivateCode(code);
		const index = achievements.value.findIndex((item) => item.id === unlocked.id);

		if (index !== -1) {
			achievements.value[index] = unlocked;
		}

		return unlocked;
	}

	async function updateNote(achievementId: string, note: string) {
		const achievement = achievements.value.find((item) => item.id === achievementId);

		if (!achievement?.userAchievementId) return;

		try {
			await apiUpdateNote(achievement.userAchievementId, note);
			achievement.personalNote = note;
		} catch (err) {
			handleError(err);
		}
	}

	return {
		achievements,
		loading,
		error,
		getById,
		totalPoints,
		unlockedCount,
		fetchAll,
		fetchOne,
		activateCode,
		updateNote,
	};
});
