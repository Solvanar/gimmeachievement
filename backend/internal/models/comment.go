package models

import "time"

type Comment struct {
	ID                string     `json:"id"`
	UserID            string     `json:"userId"`
	UserDisplayName   string     `json:"userDisplayName"`
	UserAvatar        *string    `json:"userAvatar"`
	UserAchievementID *string    `json:"userAchievementId"`
	AchievementTypeID *string    `json:"achievementTypeId"`
	Text              string     `json:"text"`
	CreatedAt         time.Time  `json:"createdAt"`
	ModifiedAt        *time.Time `json:"modifiedAt"`
	ReplyToID         *string    `json:"replyToId"`
}

type CreateCommentRequest struct {
	Text      string  `json:"text"`
	ReplyToID *string `json:"replyToId"`
}
