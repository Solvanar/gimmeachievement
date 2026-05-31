package models

import "time"

type Achievement struct {
	ID           string    `json:"id"`
	Title        string    `json:"title"`
	Subtitle     *string   `json:"subtitle"`
	Description  string    `json:"description"`
	Theme        string    `json:"theme"`
	ImageURL     *string   `json:"imageUrl"`
	Points       int       `json:"points"`
	Unlocked     bool      `json:"unlocked"`
	UnlockedAt   *string   `json:"unlockedAt"`
	PersonalNote *string   `json:"personalNote"`
	Code         *string   `json:"code"`
	Category     *string   `json:"category"`
	AccentColor  *string   `json:"accentColor"`
	CustomIcon   *string   `json:"customIcon"`
	CreatedAt    time.Time `json:"createdAt"`
}

type UpdateNoteRequest struct {
	Note string `json:"note"`
}
