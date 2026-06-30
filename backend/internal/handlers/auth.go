package handlers

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"log"
	"net"
	"net/http"
	"time"

	"gimmeachievement/backend/internal/middleware"
	"gimmeachievement/backend/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError

	return errors.As(err, &pgErr) && pgErr.Code == "23505"
}

func clientIP(r *http.Request) *string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		host = r.RemoteAddr
	}

	if host == "" {
		return nil
	}

	return &host
}

const (
	accessTokenDuration  = 15 * time.Minute
	refreshTokenDuration = 30 * 24 * time.Hour
	refreshCookieName    = "refresh_token"
)

type jwtClaims struct {
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

type AuthHandler struct {
	db        *pgxpool.Pool
	jwtSecret []byte
}

func NewAuthHandler(db *pgxpool.Pool, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		db:        db,
		jwtSecret: []byte(jwtSecret),
	}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var body models.LoginRequest

	if err := decodeJSON(r, &body); err != nil {
		writeError(w, "invalid body", http.StatusBadRequest)
		return
	}

	var userID, passwordHash string
	err := h.db.QueryRow(r.Context(),
		`SELECT id, password FROM users WHERE login = $1`,
		body.Login,
	).Scan(&userID, &passwordHash)

	if err == pgx.ErrNoRows {
		writeError(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	if err != nil {
		log.Printf("auth login query: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(body.Password)); err != nil {
		writeError(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	h.completeAuth(w, r, userID)
}

func (h *AuthHandler) Register(w http.ResponseWriter, r *http.Request) {
	var body models.RegisterRequest

	if err := decodeJSON(r, &body); err != nil {
		writeError(w, "invalid body", http.StatusBadRequest)
		return
	}

	if body.Login == "" || body.Password == "" || body.DisplayName == "" {
		writeError(w, "login, password and display name are required", http.StatusBadRequest)
		return
	}

	if len(body.Password) < 6 {
		writeError(w, "password must be at least 6 characters", http.StatusBadRequest)
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("auth register hash: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	var userID string
	err = h.db.QueryRow(r.Context(),
		`INSERT INTO users (login, password, display_name) VALUES ($1, $2, $3) RETURNING id`,
		body.Login, string(passwordHash), body.DisplayName,
	).Scan(&userID)

	if isUniqueViolation(err) {
		writeError(w, "login already taken", http.StatusConflict)
		return
	}

	if err != nil {
		log.Printf("auth register insert: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	h.completeAuth(w, r, userID)
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID := middleware.UserIDFromCtx(r)

	user, err := h.fetchUser(r.Context(), userID)
	if err != nil {
		log.Printf("auth me: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	writeJSON(w, user)
}

// completeAuth выдаёт токены, ставит refresh-cookie и возвращает юзера.
// Общая часть для Login и Register.
func (h *AuthHandler) completeAuth(w http.ResponseWriter, r *http.Request, userID string) {
	accessToken, err := h.issueAccessToken(userID)
	if err != nil {
		log.Printf("auth complete access token: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	refreshToken, refreshHash, err := generateRefreshToken()
	if err != nil {
		log.Printf("auth complete refresh token: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	expiresAt := time.Now().Add(refreshTokenDuration)

	_, err = h.db.Exec(r.Context(),
		`INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip)
		 VALUES ($1, $2, $3, $4, $5)`,
		userID, refreshHash, expiresAt, r.UserAgent(), clientIP(r),
	)
	if err != nil {
		log.Printf("auth complete store refresh token: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	user, err := h.fetchUser(r.Context(), userID)
	if err != nil {
		log.Printf("auth complete fetch user: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	setRefreshCookie(w, refreshToken, expiresAt)
	writeJSON(w, models.AuthResponse{AccessToken: accessToken, User: user})
}

func (h *AuthHandler) fetchUser(ctx context.Context, userID string) (models.User, error) {
	var user models.User

	err := h.db.QueryRow(ctx,
		`SELECT id, login, display_name, avatar, bio, created_at FROM users WHERE id = $1`,
		userID,
	).Scan(&user.ID, &user.Login, &user.DisplayName, &user.Avatar, &user.Bio, &user.CreatedAt)

	return user, err
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(refreshCookieName)
	if err != nil {
		writeError(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	tokenHash := hashToken(cookie.Value)

	var storedID, storedUserID string
	var expiresAt time.Time
	var revoked bool

	err = h.db.QueryRow(r.Context(),
		`SELECT id, user_id, expires_at, revoked FROM refresh_tokens WHERE token_hash = $1`,
		tokenHash,
	).Scan(&storedID, &storedUserID, &expiresAt, &revoked)

	if err == pgx.ErrNoRows || revoked || time.Now().After(expiresAt) {
		writeError(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	if err != nil {
		log.Printf("auth refresh query: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	newRefreshToken, newRefreshHash, err := generateRefreshToken()
	if err != nil {
		log.Printf("auth refresh generate token: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	newExpiresAt := time.Now().Add(refreshTokenDuration)

	tx, err := h.db.Begin(r.Context())
	if err != nil {
		log.Printf("auth refresh tx begin: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback(r.Context())

	if _, err := tx.Exec(r.Context(),
		`UPDATE refresh_tokens SET revoked = true WHERE id = $1`,
		storedID,
	); err != nil {
		log.Printf("auth refresh revoke: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	if _, err := tx.Exec(r.Context(),
		`INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
		storedUserID, newRefreshHash, newExpiresAt,
	); err != nil {
		log.Printf("auth refresh insert: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(r.Context()); err != nil {
		log.Printf("auth refresh tx commit: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	accessToken, err := h.issueAccessToken(storedUserID)
	if err != nil {
		log.Printf("auth refresh access token: %v", err)
		writeError(w, "internal error", http.StatusInternalServerError)
		return
	}

	setRefreshCookie(w, newRefreshToken, newExpiresAt)
	writeJSON(w, models.TokenResponse{AccessToken: accessToken})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(refreshCookieName)
	if err != nil {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	tokenHash := hashToken(cookie.Value)

	if _, err := h.db.Exec(r.Context(),
		`UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1`,
		tokenHash,
	); err != nil {
		log.Printf("auth logout revoke: %v", err)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     refreshCookieName,
		Value:    "",
		MaxAge:   -1,
		HttpOnly: true,
		Path:     "/",
	})
	w.WriteHeader(http.StatusNoContent)
}

func (h *AuthHandler) issueAccessToken(userID string) (string, error) {
	claims := jwtClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(accessTokenDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString(h.jwtSecret)
}

func generateRefreshToken() (token, hash string, err error) {
	buf := make([]byte, 32)

	if _, err = rand.Read(buf); err != nil {
		return
	}

	token = base64.URLEncoding.EncodeToString(buf)
	hash = hashToken(token)

	return
}

func hashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}

func setRefreshCookie(w http.ResponseWriter, token string, expiresAt time.Time) {
	http.SetCookie(w, &http.Cookie{
		Name:     refreshCookieName,
		Value:    token,
		Expires:  expiresAt,
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	})
}
