package routesImplementation

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"

	_ "modernc.org/sqlite"
)

func writeJsonResponse(logger *log.Logger, w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	jsonData, err := json.Marshal(data)
	if err != nil {
		go logger.Println("Error encoding JSON response: ", err)
		http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		return
	}
	w.Write(jsonData)
}

func InitDatabase(logger *log.Logger) (*sql.DB, error) {
	if err := os.MkdirAll("data", 0750); err != nil {
		logger.Printf("Failed to create database directory: %v", err)
		return nil, err
	}

	db, err := sql.Open("sqlite", "data/app.db")
	if err != nil {
		logger.Printf("Failed to open database: %v", err)
		return nil, err
	}
	db.SetMaxOpenConns(1)

	if err := db.Ping(); err != nil {
		logger.Printf("Failed to connect to database: %v", err)
		db.Close()
		return nil, err
	}

	logger.Println("Database connection initialized")

	for _, statement := range []string{
	`CREATE TABLE IF NOT EXISTS comments (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	comments TEXT NOT NULL
	)`,
	} {
		if _, err := db.Exec(statement); err != nil {
			logger.Printf("Failed to initialize database schema: %v", err)
			db.Close()
			return nil, err
		}
	}

	return db, nil
}

