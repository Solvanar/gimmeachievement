import { apiGet, apiPatch, apiPost } from './api';
import type { Achievement, AchievementComment } from '@/types/achievement';

export function fetchAchievements(): Promise<Achievement[]> {
	return apiGet<Achievement[]>('/api/achievements');
}

export function fetchAchievement(id: string): Promise<Achievement> {
	return apiGet<Achievement>(`/api/achievements/${id}`);
}

export function activateCode(code: string): Promise<Achievement> {
	return apiPost<Achievement>('/api/codes/activate', { code });
}

export function updateNote(userAchievementId: string, note: string): Promise<void> {
	return apiPatch<void>(`/api/user-achievements/${userAchievementId}/note`, { note });
}

export function fetchTypeComments(achievementTypeId: string): Promise<AchievementComment[]> {
	return apiGet<AchievementComment[]>(`/api/achievements/${achievementTypeId}/comments`);
}

export function fetchPersonalComments(userAchievementId: string): Promise<AchievementComment[]> {
	return apiGet<AchievementComment[]>(`/api/user-achievements/${userAchievementId}/comments`);
}

export function createTypeComment(
	achievementTypeId: string,
	text: string,
	replyToId?: string,
): Promise<AchievementComment> {
	return apiPost<AchievementComment>(`/api/achievements/${achievementTypeId}/comments`, {
		text,
		replyToId,
	});
}

export function createPersonalComment(
	userAchievementId: string,
	text: string,
	replyToId?: string,
): Promise<AchievementComment> {
	return apiPost<AchievementComment>(`/api/user-achievements/${userAchievementId}/comments`, {
		text,
		replyToId,
	});
}
