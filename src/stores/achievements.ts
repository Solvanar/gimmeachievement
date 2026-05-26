import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Achievement, AchievementComment } from '@/types/achievement';
import { MOCK_ACHIEVEMENTS, MOCK_COMMENTS } from '@/data/mockAchievements';
import { useNotifier } from '@/composables/useNotifier';

const STORAGE_ACHIEVEMENTS_KEY = 'gimme_achievements';
const STORAGE_COMMENTS_KEY = 'gimme_comments';

function loadAchievements(): Achievement[] {
	const saved = localStorage.getItem(STORAGE_ACHIEVEMENTS_KEY);
	if (saved) {
		try {
			return JSON.parse(saved) as Achievement[];
		} catch {
			return [...MOCK_ACHIEVEMENTS];
		}
	}

	return [...MOCK_ACHIEVEMENTS];
}

function loadComments(): Record<string, AchievementComment[]> {
	const saved = localStorage.getItem(STORAGE_COMMENTS_KEY);
	if (saved) {
		try {
			return JSON.parse(saved) as Record<string, AchievementComment[]>;
		} catch {
			return { ...MOCK_COMMENTS };
		}
	}

	return { ...MOCK_COMMENTS };
}

export const useAchievementsStore = defineStore('achievements', () => {
	const achievements = ref<Achievement[]>(loadAchievements());
	const commentsDb = ref<Record<string, AchievementComment[]>>(loadComments());
	const loading = ref(false);
	const error = ref<string | null>(null);

	const { notifyError } = useNotifier();

	const getById = computed(
		() => (id: string) =>
			achievements.value.find((achievement) => achievement.id === id),
	);

	const getComments = computed(
		() => (id: string) => commentsDb.value[id] ?? [],
	);

	const totalPoints = computed(() =>
		achievements.value
			.filter((achievement) => achievement.unlocked)
			.reduce((sum, achievement) => sum + (achievement.points ?? 0), 0),
	);

	const unlockedCount = computed(
		() => achievements.value.filter((achievement) => achievement.unlocked).length,
	);

	function saveAchievements() {
		localStorage.setItem(
			STORAGE_ACHIEVEMENTS_KEY,
			JSON.stringify(achievements.value),
		);
	}

	function saveComments() {
		localStorage.setItem(
			STORAGE_COMMENTS_KEY,
			JSON.stringify(commentsDb.value),
		);
	}

	function handleError(err: unknown) {
		error.value =
			err instanceof Error ? err.message : 'Не удалось загрузить ачивки';
		notifyError('Не удалось загрузить ачивки');
	}

	async function fetchAll() {
		loading.value = true;
		error.value = null;
		try {
			// Data is already initialized from localStorage / mock. No-op for now.
		} catch (err) {
			handleError(err);
		} finally {
			loading.value = false;
		}
	}

	async function fetchOne(id: string) {
		if (getById.value(id)) return;
		error.value = 'Ачивка не найдена';
	}

	function updateNote(id: string, note: string) {
		const achievement = achievements.value.find((item) => item.id === id);
		if (achievement) {
			achievement.personalNote = note;
			saveAchievements();
		}
	}

	function unlockAchievement(id: string) {
		const achievement = achievements.value.find((item) => item.id === id);
		if (achievement && !achievement.unlocked) {
			achievement.unlocked = true;
			achievement.unlockedAt = new Date().toISOString().split('T')[0];
			saveAchievements();
		}
	}

	function addComment(achievementId: string, text: string, author: string, avatar: string) {
		const newComment: AchievementComment = {
			id: `${achievementId}-c-${Date.now()}`,
			author,
			avatar,
			text,
			timestamp: 'Только что',
		};

		if (!commentsDb.value[achievementId]) {
			commentsDb.value[achievementId] = [];
		}

		commentsDb.value[achievementId] = [
			newComment,
			...commentsDb.value[achievementId],
		];
		saveComments();
	}

	return {
		achievements,
		commentsDb,
		loading,
		error,
		getById,
		getComments,
		totalPoints,
		unlockedCount,
		fetchAll,
		fetchOne,
		updateNote,
		unlockAchievement,
		addComment,
	};
});
