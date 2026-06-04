import { apiGet, apiPatch, apiPost } from './api';
import type { Achievement, AchievementComment } from '@/types/achievement';

export function fetchAchievements(): Promise<Achievement[]> {
	return apiGet<Achievement[]>('/api/achievements');
}

export function fetchAchievement(id: string): Promise<Achievement> {
	return apiGet<Achievement>(`/api/achievements/${id}`);
}

export function activateCode(code: string): Promise<Achievement> {
	return apiPost<Achievement>('/api/achievements/activate', { code });
}

export function updateMe(achievementTypeId: string, note: string): Promise<void> {
	return apiPatch<void>(`/api/achievements/${achievementTypeId}/me`, { note });
}

export function fetchGlobalComments(achievementTypeId: string): Promise<AchievementComment[]> {
	return apiGet<AchievementComment[]>(`/api/achievements/${achievementTypeId}/comments/global`);
}

export function fetchPrivateComments(userAchievementId: string): Promise<AchievementComment[]> {
	return apiGet<AchievementComment[]>(`/api/user-achievements/${userAchievementId}/comments/private`);
}

export function createGlobalComment(
	achievementTypeId: string,
	text: string,
	replyToId?: string,
): Promise<AchievementComment> {
	return apiPost<AchievementComment>(`/api/achievements/${achievementTypeId}/comments/global`, {
		text,
		replyToId,
	});
}

export function createPrivateComment(
	userAchievementId: string,
	text: string,
	replyToId?: string,
): Promise<AchievementComment> {
	return apiPost<AchievementComment>(`/api/user-achievements/${userAchievementId}/comments/private`, {
		text,
		replyToId,
	});
}
