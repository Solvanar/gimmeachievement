package models

import "time"

type Achievement struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Subtitle    *string   `json:"subtitle"`
	Description string    `json:"description"`
	Theme       string    `json:"theme"`
	ImageURL    *string   `json:"imageUrl"`
	Points      int       `json:"points"`
	CreatedAt   time.Time `json:"createdAt"`
}

// AchievementWithStatus — ачивка из каталога + статус разблокировки для конкретного юзера.
// UserAchievementID == nil означает что ачивка не разблокирована.
type AchievementWithStatus struct {
	Achievement
	UserAchievementID *string `json:"userAchievementId"`
	Unlocked          bool    `json:"unlocked"`
	UnlockedAt        *string `json:"unlockedAt"`
	PersonalNote      *string `json:"personalNote"`
}

type ActivateCodeRequest struct {
	Code string `json:"code"`
}

type UpdateNoteRequest struct {
	Note string `json:"note"`
}
