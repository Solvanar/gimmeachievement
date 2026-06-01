package models

import "time"

type User struct {
	ID          string    `json:"id"`
	Login       string    `json:"login"`
	DisplayName string    `json:"displayName"`
	Avatar      *string   `json:"avatar"`
	Bio         *string   `json:"bio"`
	CreatedAt   time.Time `json:"createdAt"`
}
