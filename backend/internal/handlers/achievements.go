package handlers

import (
	"log"
	"net/http"

	"gimmeachievement/backend/internal/middleware"
	"gimmeachievement/backend/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

const achievementTypeFields = `
	at.id, at.title, at.subtitle, at.description, at.theme, at.image_url,
	at.points, at.created_at,
	ua.id, TO_CHAR(ua.unlocked_at, 'YYYY-MM-DD'), ua.personal_note`

type AchievementsHandler struct {
	db *pgxpool.Pool
}

func NewAchievementsHandler(db *pgxpool.Pool) *AchievementsHandler {
	return &AchievementsHandler{db: db}
}

func (h *AchievementsHandler) List(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromCtx(r)

	rows, err := h.db.Query(r.Context(), `
		SELECT `+achievementTypeFields+`
		FROM achievement_types at
		LEFT JOIN user_achievements ua
			ON ua.achievement_type_id = at.id AND ua.user_id = $1
		ORDER BY ua.unlocked_at DESC NULLS LAST, at.created_at`,
		userID,
	)
	if err != nil {
		log.Printf("achievements list: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	result := make([]models.AchievementWithStatus, 0)

	for rows.Next() {
		view, err := scanAchievementWithStatus(rows)
		if err != nil {
			log.Printf("achievements list scan: %v", err)
			writeError(w, "internal error", http.StatusInternalServerError)
			return
		}
		result = append(result, view)
	}

	if err := rows.Err(); err != nil {
		log.Printf("achievements list rows: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	writeJSON(w, result)
}

func (h *AchievementsHandler) Get(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromCtx(r)
	typeID := r.PathValue("id")

	row := h.db.QueryRow(r.Context(), `
		SELECT `+achievementTypeFields+`
		FROM achievement_types at
		LEFT JOIN user_achievements ua
			ON ua.achievement_type_id = at.id AND ua.user_id = $2
		WHERE at.id = $1`,
		typeID, userID,
	)

	view, err := scanAchievementWithStatus(row)

	if err == pgx.ErrNoRows {
		writeError(w, "not found", http.StatusNotFound)
		return
	}

	if err != nil {
		log.Printf("achievement get: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	writeJSON(w, view)
}

func (h *AchievementsHandler) UpdateNote(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromCtx(r)
	uaID := r.PathValue("id")

	var body models.UpdateNoteRequest

	if err := decodeJSON(r, &body); err != nil {
		writeError(w, "invalid body", http.StatusBadRequest)
		return
	}

	result, err := h.db.Exec(r.Context(),
		`UPDATE user_achievements SET personal_note = $1 WHERE id = $2 AND user_id = $3`,
		body.Note, uaID, userID,
	)
	if err != nil {
		log.Printf("update note: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	if result.RowsAffected() == 0 {
		writeError(w, "not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanAchievementWithStatus(row rowScanner) (models.AchievementWithStatus, error) {
	var view models.AchievementWithStatus

	err := row.Scan(
		&view.ID, &view.Title, &view.Subtitle, &view.Description,
		&view.Theme, &view.ImageURL, &view.Points,
		&view.CreatedAt,
		&view.UserAchievementID, &view.UnlockedAt, &view.PersonalNote,
	)
	if err != nil {
		return view, err
	}

	view.Unlocked = view.UserAchievementID != nil

	return view, nil
}
