export const ACHIEVEMENT_THEMES = {
  GAMING: 'gaming',
  COOKING: 'cooking',
  DEFAULT: 'default',
} as const

export type AchievementTheme = (typeof ACHIEVEMENT_THEMES)[keyof typeof ACHIEVEMENT_THEMES]

export const ACHIEVEMENT_THEME_LABELS: Record<AchievementTheme, string> = {
  [ACHIEVEMENT_THEMES.GAMING]: 'Игры',
  [ACHIEVEMENT_THEMES.COOKING]: 'Кулинария',
  [ACHIEVEMENT_THEMES.DEFAULT]: 'Общее',
}
