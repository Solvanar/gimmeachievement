package handlers

import (
	"log"
	"net/http"

	"gimmeachievement/backend/internal/middleware"
	"gimmeachievement/backend/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CodesHandler struct {
	db *pgxpool.Pool
}

func NewCodesHandler(db *pgxpool.Pool) *CodesHandler {
	return &CodesHandler{db: db}
}

func (h *CodesHandler) Activate(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromCtx(r)

	var body models.ActivateCodeRequest

	if err := decodeJSON(r, &body); err != nil {
		writeError(w, "invalid body", http.StatusBadRequest)
		return
	}

	if body.Code == "" {
		writeError(w, "code is required", http.StatusBadRequest)
		return
	}

	tx, err := h.db.Begin(r.Context())
	if err != nil {
		log.Printf("codes activate tx begin: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback(r.Context())

	// Блокируем строку кода чтобы исключить race condition при параллельных запросах
	var achievementTypeID string
	err = tx.QueryRow(r.Context(),
		`SELECT achievement_type_id FROM codes WHERE code = $1 AND is_used = false FOR UPDATE`,
		body.Code,
	).Scan(&achievementTypeID)

	if err == pgx.ErrNoRows {
		// Проверяем, существует ли код вообще, чтобы вернуть правильную ошибку
		var exists bool
		h.db.QueryRow(r.Context(), `SELECT EXISTS(SELECT 1 FROM codes WHERE code = $1)`, body.Code).Scan(&exists)

		if exists {
			writeError(w, "code already used", http.StatusConflict)
		} else {
			writeError(w, "code not found", http.StatusNotFound)
		}

		return
	}

	if err != nil {
		log.Printf("codes activate lock: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	// Проверяем, нет ли у юзера уже этого типа ачивки
	var existingID string
	err = tx.QueryRow(r.Context(),
		`SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_type_id = $2`,
		userID, achievementTypeID,
	).Scan(&existingID)

	if err != nil && err != pgx.ErrNoRows {
		log.Printf("codes activate check existing: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	if err == nil {
		writeError(w, "achievement already unlocked", http.StatusConflict)
		return
	}

	if _, err := tx.Exec(r.Context(),
		`UPDATE codes SET is_used = true WHERE code = $1`,
		body.Code,
	); err != nil {
		log.Printf("codes activate mark used: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	if _, err := tx.Exec(r.Context(),
		`INSERT INTO user_achievements (user_id, code, achievement_type_id) VALUES ($1, $2, $3)`,
		userID, body.Code, achievementTypeID,
	); err != nil {
		log.Printf("codes activate insert: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(r.Context()); err != nil {
		log.Printf("codes activate tx commit: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	// Возвращаем полный view ачивки — фронт сразу получает всё нужное
	row := h.db.QueryRow(r.Context(), `
		SELECT `+achievementTypeFields+`
		FROM achievement_types at
		LEFT JOIN user_achievements ua
			ON ua.achievement_type_id = at.id AND ua.user_id = $2
		WHERE at.id = $1`,
		achievementTypeID, userID,
	)

	view, err := scanAchievementWithStatus(row)
	if err != nil {
		log.Printf("codes activate fetch result: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	writeJSON(w, view)
}
