package handlers

import (
	"encoding/json"
	"net/http"

	"gimmeachievement/backend/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

const selectFields = `
	id, title, subtitle, description, theme, image_url,
	points, unlocked, TO_CHAR(unlocked_at, 'YYYY-MM-DD'),
	personal_note, code, category, accent_color, custom_icon,
	created_at`

type AchievementsHandler struct {
	db *pgxpool.Pool
}

func NewAchievementsHandler(db *pgxpool.Pool) *AchievementsHandler {
	return &AchievementsHandler{db: db}
}

func (h *AchievementsHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT`+selectFields+` FROM achievements ORDER BY unlocked DESC, unlocked_at DESC NULLS LAST`,
	)
	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	achievements := make([]models.Achievement, 0)

	for rows.Next() {
		var a models.Achievement
		if err := rows.Scan(
			&a.ID, &a.Title, &a.Subtitle, &a.Description, &a.Theme, &a.ImageURL,
			&a.Points, &a.Unlocked, &a.UnlockedAt,
			&a.PersonalNote, &a.Code, &a.Category, &a.AccentColor, &a.CustomIcon,
			&a.CreatedAt,
		); err != nil {
			http.Error(w, "scan error", http.StatusInternalServerError)
			return
		}
		achievements = append(achievements, a)
	}

	writeJSON(w, achievements)
}

func (h *AchievementsHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var a models.Achievement
	err := h.db.QueryRow(r.Context(),
		`SELECT`+selectFields+` FROM achievements WHERE id = $1`,
		id,
	).Scan(
		&a.ID, &a.Title, &a.Subtitle, &a.Description, &a.Theme, &a.ImageURL,
		&a.Points, &a.Unlocked, &a.UnlockedAt,
		&a.PersonalNote, &a.Code, &a.Category, &a.AccentColor, &a.CustomIcon,
		&a.CreatedAt,
	)

	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	writeJSON(w, a)
}

func (h *AchievementsHandler) Unlock(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	_, err := h.db.Exec(r.Context(),
		`UPDATE achievements SET unlocked = true, unlocked_at = CURRENT_DATE WHERE id = $1`,
		id,
	)

	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *AchievementsHandler) UpdateNote(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")

	var body models.UpdateNoteRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}

	_, err := h.db.Exec(r.Context(),
		`UPDATE achievements SET personal_note = $1 WHERE id = $2`,
		body.Note, id,
	)

	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}
