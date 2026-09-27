package routes

import (
	"errors"
	"go-api/routesImplementation"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func SetupRoutes() error {
	if err := os.MkdirAll("./logs", 0750); err != nil {
		return err
	}
	file, err := os.OpenFile(
		"./logs/api.log",
		os.O_CREATE|os.O_WRONLY|os.O_APPEND,
		0640,
	)
	if err != nil {
		return err
	}
	defer file.Close()
	logger := log.New(file, "", log.LstdFlags)

	r := chi.NewRouter()
	r.Use(middleware.RequestLogger(&middleware.DefaultLogFormatter{
		Logger:  logger,
		NoColor: true,
	}))
	r.Use(middleware.Recoverer)
	r.Post("/api/go/hash/sha512", routesImplementation.Sha512Route(logger))
	r.Post("/api/go/hash/md5", routesImplementation.Md5Route(logger))
	r.Post("/api/go/hash/sha256", routesImplementation.Sha256Route(logger))
	r.Post("/api/go/hash/sha1", routesImplementation.Sha1Route(logger))
	server := &http.Server{
		Addr:              ":8080",
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	go logger.Println("API is working on http://localhost:8080")
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		return err
	}
	return nil
}
