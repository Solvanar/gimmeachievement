import { apiGet } from './api';
import type { Achievement } from '@/types/achievement';

export function fetchAchievements(): Promise<Achievement[]> {
	return apiGet<Achievement[]>('/api/achievements');
}

export function fetchAchievement(id: string): Promise<Achievement> {
	return apiGet<Achievement>(`/api/achievements/${id}`);
}
