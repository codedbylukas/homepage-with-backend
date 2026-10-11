package routesImplementation

import (
	"database/sql"
	"log"
	"net/http"
	"strings"
)

func BugsAddRoute(logger *log.Logger, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		titleData := r.FormValue("title")
		descriptionData := r.FormValue("description")
		if strings.TrimSpace(titleData) == "" || strings.TrimSpace(descriptionData) == "" {
			logger.Println("Fehlende Parameter in der BugsRoute")
			http.Error(w, "Fehlende Parameter", http.StatusBadRequest)
			return
		}

		if _, err := db.Exec(
			"INSERT INTO bugs (title, description) VALUES (?, ?)",
			titleData,
			descriptionData,
		); err != nil {
			logger.Printf("Fehler beim speichern des Fehlers: %v", err)
			http.Error(w, "Fehler konnte nicht gespeichert werden", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}

func  BugsGetAllRoute(logger *log.Logger, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type bug struct {
			ID          int    `json:"id"`
			Title       string `json:"title"`
			Description string `json:"description"`
		}

		rows, err := db.Query("SELECT id, title, description FROM bugs ORDER BY id")
		if err != nil {
			logger.Printf("Fehler beim Abfragen der Fehler: %v", err)
			http.Error(w, "Fehler konnten nicht geladen werden", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		bugs := make([]bug, 0)
		for rows.Next() {
			var item bug
			if err := rows.Scan(&item.ID, &item.Title, &item.Description); err != nil {
				logger.Printf("Fehler beim suchen nach dem Fehler.: %v", err)
				http.Error(w, "Fehler konnten nicht geladen werden", http.StatusInternalServerError)
				return
			}
			bugs = append(bugs, item)
		}
		if err := rows.Err(); err != nil {
			logger.Printf("Fehler beim durchgehen aller Bugs: %v", err)
			http.Error(w, "Fehler konnten nicht geladen werden", http.StatusInternalServerError)
			return
		}

		writeJsonResponse(logger, w, bugs)
	}
}

