import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchAchievements, fetchAchievement } from '../achievements';
import { apiGet } from '../api';
import type { Achievement } from '@/types/achievement';

vi.mock('../api', () => ({
	apiGet: vi.fn(),
}));

const apiGetMock = vi.mocked(apiGet);

describe('achievements service', () => {
	beforeEach(() => {
		apiGetMock.mockReset();
	});

	describe('fetchAchievements', () => {
		it('get list of achievements', async () => {
			const payload: Achievement[] = [
				{
					id: '1',
					title: 'Test',
					description: 'desc',
					theme: 'cyber',
					createdAt: '2026-05-21T00:00:00Z',
				},
			];
			apiGetMock.mockResolvedValueOnce(payload);

			const result = await fetchAchievements();
			expect(result).toBe(payload);
		});
	});

	describe('fetchAchievement', () => {
		it('get single achievement with the id', async () => {
			apiGetMock.mockResolvedValueOnce({} as Achievement);

			await fetchAchievement('abc-123');

			expect(apiGetMock).toHaveBeenCalledExactlyOnceWith(
				'/api/achievements/abc-123',
			);
		});
	});
});
