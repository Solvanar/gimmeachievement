package handlers

import (
	"encoding/json"
	"net/http"

	"gimmeachievement/backend/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AchievementsHandler struct {
	db *pgxpool.Pool
}

func NewAchievementsHandler(db *pgxpool.Pool) *AchievementsHandler {
	return &AchievementsHandler{db: db}
}

func (h *AchievementsHandler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.db.Query(r.Context(),
		`SELECT id, title, description, theme, image_url, created_at
		 FROM achievements
		 ORDER BY created_at DESC`,
	)
	if err != nil {
		http.Error(w, "db error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	achievements := make([]models.Achievement, 0)
	for rows.Next() {
		var a models.Achievement
		if err := rows.Scan(&a.ID, &a.Title, &a.Description, &a.Theme, &a.ImageURL, &a.CreatedAt); err != nil {
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
		`SELECT id, title, description, theme, image_url, created_at
		 FROM achievements WHERE id = $1`,
		id,
	).Scan(&a.ID, &a.Title, &a.Description, &a.Theme, &a.ImageURL, &a.CreatedAt)

	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	writeJSON(w, a)
}

func writeJSON(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}
