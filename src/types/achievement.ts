import type { AchievementTheme } from '@/constants/achievementThemes';

export type { AchievementTheme };

export interface Achievement {
	id: string;
	title: string;
	subtitle?: string;
	description: string;
	theme: AchievementTheme;
	imageUrl?: string;
	points: number;
	createdAt: string;
	userAchievementId?: string;
	unlocked: boolean;
	unlockedAt?: string;
	personalNote?: string;
}

export interface AchievementComment {
	id: string;
	userId: string;
	userDisplayName: string;
	userAvatar?: string;
	userAchievementId?: string;
	achievementTypeId?: string;
	text: string;
	createdAt: string;
	modifiedAt?: string;
	replyToId?: string;
}
