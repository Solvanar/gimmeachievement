import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useAchievementsStore } from '@/stores/achievements';
import { rankForUnlocked } from '@/constants/ranks';
import { formatDate } from '@/composables/useFormatDate';

export interface UserProfile {
	username: string;
	gamerTag: string;
	avatar: string;
	bio: string;
	rank: string;
	joinDate: string;
}

const FALLBACK_AVATAR =
	'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200&h=200';

export const useProfileStore = defineStore('profile', () => {
	const auth = useAuthStore();
	const achievements = useAchievementsStore();

	const profile = computed<UserProfile>(() => {
		const user = auth.user;

		return {
			username: user?.displayName ?? '',
			gamerTag: user?.login ?? '',
			avatar: user?.avatar || FALLBACK_AVATAR,
			bio: user?.bio ?? '',
			rank: rankForUnlocked(achievements.unlockedCount),
			joinDate: user ? formatDate(user.createdAt) : '',
		};
	});

	return { profile };
});
