import { ref } from 'vue';
import type { Achievement } from '@/types/achievement';

const toastAchievement = ref<Achievement | null>(null);
const showToast = ref(false);

export function useAchievementToast() {
	function triggerToast(achievement: Achievement) {
		toastAchievement.value = achievement;
		showToast.value = true;
		window.setTimeout(() => {
			showToast.value = false;
		}, 5500);
	}

	return { toastAchievement, showToast, triggerToast };
}
