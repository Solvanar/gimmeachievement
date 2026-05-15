import type { AchievementTheme } from '@/constants/achievementThemes'

export type { AchievementTheme }

export interface Achievement {
  id: string
  title: string
  description: string
  theme: AchievementTheme
  imageUrl?: string
  personalNote?: string
  createdAt: string
}
