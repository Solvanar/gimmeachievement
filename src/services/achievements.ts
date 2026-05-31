import { apiGet, apiPatch } from './api';
import type { Achievement } from '@/types/achievement';

export function fetchAchievements(): Promise<Achievement[]> {
	return apiGet<Achievement[]>('/api/achievements');
}

export function fetchAchievement(id: string): Promise<Achievement> {
	return apiGet<Achievement>(`/api/achievements/${id}`);
}

export function unlockAchievement(id: string): Promise<void> {
	return apiPatch<void>(`/api/achievements/${id}/unlock`);
}

export function updateNote(id: string, note: string): Promise<void> {
	return apiPatch<void>(`/api/achievements/${id}/note`, { note });
}
