package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"gimmeachievement/backend/internal/db"
	"gimmeachievement/backend/internal/handlers"
	"gimmeachievement/backend/internal/middleware"
)

func main() {
	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer pool.Close()
	log.Println("connected to database")

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-secret-change-in-production"
	}

	auth := handlers.NewAuthHandler(pool, jwtSecret)
	achievements := handlers.NewAchievementsHandler(pool)
	codes := handlers.NewCodesHandler(pool)
	comments := handlers.NewCommentsHandler(pool)
	requireAuth := middleware.NewAuthMiddleware(jwtSecret).Require

	mux := http.NewServeMux()

	// Auth (публичные)
	mux.HandleFunc("POST /api/auth/login", auth.Login)
	mux.HandleFunc("POST /api/auth/refresh", auth.Refresh)
	mux.HandleFunc("POST /api/auth/logout", auth.Logout)

	// Ачивки (требуют авторизации)
	mux.HandleFunc("GET /api/achievements", requireAuth(achievements.List))
	mux.HandleFunc("GET /api/achievements/{id}", requireAuth(achievements.Get))
	mux.HandleFunc("PATCH /api/user-achievements/{id}/note", requireAuth(achievements.UpdateNote))

	// Коды пинов (требуют авторизации)
	mux.HandleFunc("POST /api/codes/activate", requireAuth(codes.Activate))

	// Комментарии (требуют авторизации)
	mux.HandleFunc("GET /api/achievements/{id}/comments", requireAuth(comments.ListForType))
	mux.HandleFunc("POST /api/achievements/{id}/comments", requireAuth(comments.CreateForType))
	mux.HandleFunc("GET /api/user-achievements/{id}/comments", requireAuth(comments.ListForUserAchievement))
	mux.HandleFunc("POST /api/user-achievements/{id}/comments", requireAuth(comments.CreateForUserAchievement))

	port := os.Getenv("PORT")
	if port == ""  {
		port = "8080"
	}

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, corsMiddleware(mux)); err != nil {
		log.Fatal(err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := os.Getenv("CORS_ORIGIN")
		if origin == "" {
			origin = "http://localhost:5173"
		}

		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		// Нужно для передачи cookie с refresh token
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
