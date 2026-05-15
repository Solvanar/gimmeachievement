export type AchievementTheme = 'gaming' | 'cooking' | 'default'

export interface Achievement {
  id: string
  title: string
  description: string
  theme: AchievementTheme
  imageUrl?: string
  personalNote?: string
  createdAt: string
}
