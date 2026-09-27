package routes

import (
	"log"
	"net/http"
	"time"

	"go-api/routesImplementation"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)
func SetupRoutes() {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Post("/api/go/hash/sha512", routesImplementation.Sha512Route)
	r.Post("/api/go/hash/md5", routesImplementation.Md5Route)
	server := &http.Server{
	Addr:              ":8080",
	Handler:           r,
	ReadHeaderTimeout: 5 * time.Second,
	ReadTimeout:       10 * time.Second,
	WriteTimeout:      10 * time.Second,
	IdleTimeout:       60 * time.Second,
	}
	log.Println("API is working on http://localhost:8080")
	log.Fatal(server.ListenAndServe())
}