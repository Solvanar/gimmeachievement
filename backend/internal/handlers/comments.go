package handlers

import (
	"context"
	"log"
	"net/http"

	"gimmeachievement/backend/internal/middleware"
	"gimmeachievement/backend/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const commentFields = `
	c.id, c.user_id, u.display_name, u.avatar,
	c.user_achievement_id, c.achievement_type_id,
	c.text, c.created_at, c.modified_at, c.reply_to_id`

type CommentsHandler struct {
	db *pgxpool.Pool
}

func NewCommentsHandler(db *pgxpool.Pool) *CommentsHandler {
	return &CommentsHandler{db: db}
}

func (h *CommentsHandler) ListGlobal(w http.ResponseWriter, r *http.Request) {
	typeID := r.PathValue("id")

	rows, err := h.db.Query(r.Context(), `
		SELECT `+commentFields+`
		FROM comments c
		JOIN users u ON u.id = c.user_id
		WHERE c.achievement_type_id = $1
		ORDER BY c.created_at`,
		typeID,
	)
	if err != nil {
		log.Printf("comments list for type: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	writeJSON(w, scanComments(rows))
}

func (h *CommentsHandler) CreateGlobal(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromCtx(r)
	typeID := r.PathValue("id")

	var body models.CreateCommentRequest

	if err := decodeJSON(r, &body); err != nil {
		writeError(w, "invalid body", http.StatusBadRequest)
		return
	}

	if body.Text == "" {
		writeError(w, "text is required", http.StatusBadRequest)
		return
	}

	comment, err := h.insertComment(r.Context(), userID, nil, &typeID, body)
	if err != nil {
		log.Printf("comments create for type: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	writeJSON(w, comment)
}

func (h *CommentsHandler) ListPrivate(w http.ResponseWriter, r *http.Request) {
	uaID := r.PathValue("id")

	rows, err := h.db.Query(r.Context(), `
		SELECT `+commentFields+`
		FROM comments c
		JOIN users u ON u.id = c.user_id
		WHERE c.user_achievement_id = $1
		ORDER BY c.created_at`,
		uaID,
	)
	if err != nil {
		log.Printf("comments list for user achievement: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	writeJSON(w, scanComments(rows))
}

func (h *CommentsHandler) CreatePrivate(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromCtx(r)
	uaID := r.PathValue("id")

	var body models.CreateCommentRequest

	if err := decodeJSON(r, &body); err != nil {
		writeError(w, "invalid body", http.StatusBadRequest)
		return
	}

	if body.Text == "" {
		writeError(w, "text is required", http.StatusBadRequest)
		return
	}

	comment, err := h.insertComment(r.Context(), userID, &uaID, nil, body)
	if err != nil {
		log.Printf("comments create for user achievement: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	writeJSON(w, comment)
}

func (h *CommentsHandler) insertComment(
	ctx context.Context,
	userID string,
	uaID *string,
	typeID *string,
	body models.CreateCommentRequest,
) (models.Comment, error) {
	var comment models.Comment

	err := h.db.QueryRow(ctx, `
		WITH inserted AS (
			INSERT INTO comments (user_id, user_achievement_id, achievement_type_id, text, reply_to_id)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, user_id, user_achievement_id, achievement_type_id, text, created_at, modified_at, reply_to_id
		)
		SELECT inserted.id, inserted.user_id, u.display_name, u.avatar,
		       inserted.user_achievement_id, inserted.achievement_type_id,
		       inserted.text, inserted.created_at, inserted.modified_at, inserted.reply_to_id
		FROM inserted
		JOIN users u ON u.id = inserted.user_id`,
		userID, uaID, typeID, body.Text, body.ReplyToID,
	).Scan(
		&comment.ID, &comment.UserID, &comment.UserDisplayName, &comment.UserAvatar,
		&comment.UserAchievementID, &comment.AchievementTypeID,
		&comment.Text, &comment.CreatedAt, &comment.ModifiedAt, &comment.ReplyToID,
	)

	return comment, err
}

func scanComments(rows pgx.Rows) []models.Comment {
	result := make([]models.Comment, 0)

	for rows.Next() {
		var comment models.Comment

		if err := rows.Scan(
			&comment.ID, &comment.UserID, &comment.UserDisplayName, &comment.UserAvatar,
			&comment.UserAchievementID, &comment.AchievementTypeID,
			&comment.Text, &comment.CreatedAt, &comment.ModifiedAt, &comment.ReplyToID,
		); err != nil {
			break
		}

		result = append(result, comment)
	}

	return result
}
