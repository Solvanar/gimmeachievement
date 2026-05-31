import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { Achievement, AchievementComment } from '@/types/achievement';
import {
	fetchAchievements,
	fetchAchievement,
	unlockAchievement as apiUnlock,
	updateNote as apiUpdateNote,
} from '@/services/achievements';
import { useNotifier } from '@/composables/useNotifier';

const STORAGE_COMMENTS_KEY = 'gimme_comments';

function loadComments(): Record<string, AchievementComment[]> {
	const saved = localStorage.getItem(STORAGE_COMMENTS_KEY);
	if (!saved) return {};

	try {
		return JSON.parse(saved) as Record<string, AchievementComment[]>;
	} catch {
		return {};
	}
}

function saveComments(db: Record<string, AchievementComment[]>) {
	localStorage.setItem(STORAGE_COMMENTS_KEY, JSON.stringify(db));
}

export const useAchievementsStore = defineStore('achievements', () => {
	const achievements = ref<Achievement[]>([]);
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

	function handleError(err: unknown) {
		error.value =
			err instanceof Error ? err.message : 'Не удалось загрузить ачивки';
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

	async function updateNote(id: string, note: string) {
		const achievement = achievements.value.find((item) => item.id === id);

		if (!achievement) return;

		try {
			await apiUpdateNote(id, note);
			achievement.personalNote = note;
		} catch (err) {
			handleError(err);
		}
	}

	async function unlockAchievement(id: string) {
		const achievement = achievements.value.find((item) => item.id === id);

		if (!achievement || achievement.unlocked) return;

		try {
			await apiUnlock(id);
			achievement.unlocked = true;
			achievement.unlockedAt = new Date().toISOString().split('T')[0];
		} catch (err) {
			handleError(err);
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
		saveComments(commentsDb.value);
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
