import type { AchievementTheme } from '@/constants/achievementThemes';

export type { AchievementTheme };

export type AchievementCategory = 'gaming' | 'pixel' | 'lifestyle' | 'creative';

export interface AchievementComment {
	id: string;
	author: string;
	avatar: string;
	text: string;
	timestamp: string;
}

export interface Achievement {
	id: string;
	title: string;
	subtitle?: string;
	description: string;
	theme: AchievementTheme;
	imageUrl?: string;
	personalNote?: string;
	createdAt: string;
	code?: string;
	points?: number;
	unlocked?: boolean;
	unlockedAt?: string;
	category?: AchievementCategory;
	accentColor?: string;
	customIcon?: string;
}
