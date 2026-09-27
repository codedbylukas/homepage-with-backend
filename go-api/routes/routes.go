package routes

import (
	"go-api/routesImplementation"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func SetupRoutes() {
	if err := os.MkdirAll("./logs", 0750); err != nil {
		log.Fatalf("Logverzeichnis konnte nicht erstellt werden: %v", err)
	}
	file, err := os.OpenFile(
		"./logs/api.log",
		os.O_CREATE|os.O_WRONLY|os.O_APPEND,
		0640,
	)
	if err != nil {
		log.Fatalf("Logdatei konnte nicht geöffnet werden: %v", err)
	}
	defer file.Close()
	log.SetOutput(file)
	log.SetFlags(log.LstdFlags)

	r := chi.NewRouter()
	r.Use(middleware.RequestLogger(&middleware.DefaultLogFormatter{
		Logger:  log.Default(),
		NoColor: true,
	}))
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