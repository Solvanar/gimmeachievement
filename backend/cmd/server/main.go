package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"gimmeachievement/backend/internal/db"
	"gimmeachievement/backend/internal/handlers"
)

func main() {
	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer pool.Close()
	log.Println("connected to database")

	achievements := handlers.NewAchievementsHandler(pool)

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/achievements", achievements.List)
	mux.HandleFunc("GET /api/achievements/{id}", achievements.Get)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, cors(mux)); err != nil {
		log.Fatal(err)
	}
}

// cors разрешает запросы с dev-сервера фронта
func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
