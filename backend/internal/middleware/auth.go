package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const contextKeyUserID contextKey = "userID"

type jwtClaims struct {
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

type AuthMiddleware struct {
	jwtSecret []byte
}

func NewAuthMiddleware(jwtSecret string) *AuthMiddleware {
	return &AuthMiddleware{jwtSecret: []byte(jwtSecret)}
}

func (m *AuthMiddleware) Require(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")

		if !strings.HasPrefix(header, "Bearer ") {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(header, "Bearer ")
		claims := &jwtClaims{}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return m.jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), contextKeyUserID, claims.UserID)
		next(w, r.WithContext(ctx))
	}
}

func UserIDFromCtx(r *http.Request) string {
	return r.Context().Value(contextKeyUserID).(string)
}
