package models

import "time"

type Achievement struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Theme       string    `json:"theme"`
	ImageURL    *string   `json:"imageUrl"`
	CreatedAt   time.Time `json:"createdAt"`
}
