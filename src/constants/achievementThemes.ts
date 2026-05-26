export const ACHIEVEMENT_THEMES = {
	CYBER: 'cyber',
	RETRO: 'retro',
	COZY: 'cozy',
	FOREST: 'forest',
	DEFAULT: 'default',
} as const;

export type AchievementTheme =
	(typeof ACHIEVEMENT_THEMES)[keyof typeof ACHIEVEMENT_THEMES];

export const ACHIEVEMENT_THEME_LABELS: Record<AchievementTheme, string> = {
	cyber: '🎮 Геймерский',
	retro: '👾 Пиксельный',
	cozy: '☕ Уютный',
	forest: '🌿 Лесной',
	default: 'Общее',
};
