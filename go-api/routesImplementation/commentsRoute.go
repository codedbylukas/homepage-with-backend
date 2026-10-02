package routesImplementation

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
)

func CommentsAddRoute(logger *log.Logger, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		titleData := r.FormValue("title")
		descriptionData := r.FormValue("description")
		if strings.TrimSpace(titleData) == "" || strings.TrimSpace(descriptionData) == "" {
			logger.Println("Fehlende Parameter in der CommentsRoute")
			http.Error(w, "Fehlende Parameter", http.StatusBadRequest)
			return
		}

		if _, err := db.Exec(
			"INSERT INTO comments (name, comments) VALUES (?, ?)",
			titleData,
			descriptionData,
		); err != nil {
			logger.Printf("Fehler beim speichern des Kommentaes: %v", err)
			http.Error(w, "Kommentar konnte nicht gespeichert werden", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}

func CommentsGetAllRoute(logger *log.Logger, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		type comment struct {
			ID       int    `json:"id"`
			Name     string `json:"name"`
			Comments string `json:"comments"`
		}

		rows, err := db.Query("SELECT id, name, comments FROM comments ORDER BY id")
		if err != nil {
			logger.Printf("Fehler beim Abfragen der Kommentare: %v", err)
			http.Error(w, "Kommentare konnten nicht geladen werden", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		comments := make([]comment, 0)
		for rows.Next() {
			var item comment
			if err := rows.Scan(&item.ID, &item.Name, &item.Comments); err != nil {
				logger.Printf("Fehler beim suchen nach dem Kommentar.: %v", err)
				http.Error(w, "Kommentare konnten nicht geladen werden", http.StatusInternalServerError)
				return
			}
			comments = append(comments, item)
		}
		if err := rows.Err(); err != nil {
			logger.Printf("Fehler beim durchgehen aller Kommentare: %v", err)
			http.Error(w, "Kommentare konnten nicht geladen werden", http.StatusInternalServerError)
			return
		}

		writeJsonResponse(logger, w, comments)
	}
}

func CommentsDeleteRoute(logger *log.Logger, db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		if strings.TrimSpace(id) == "" {
			logger.Println("Fehlende Parameter in der CommentsDeleteRoute")
			http.Error(w, "Fehlende Parameter", http.StatusBadRequest)
			return
		}

		if _, err := db.Exec("DELETE FROM comments WHERE id = ?", id); err != nil {
			logger.Printf("Fehler beim löschen des Kommentares: %v", err)
			http.Error(w, "Kommentar konnte nicht gelöscht werden", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
