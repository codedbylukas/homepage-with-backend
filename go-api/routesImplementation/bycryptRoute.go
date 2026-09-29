package routesImplementation

import (
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func BycryptHash(text string, logger *log.Logger) string {
	pass := []byte(text)
	hashBytes, err := bcrypt.GenerateFromPassword(pass, bcrypt.DefaultCost)
	if err != nil {
		go logger.Println("Fehler beim Generieren des Hashes:", err)
		return ""
	}
	err = bcrypt.CompareHashAndPassword(hashBytes, pass)
	go logger.Println("Gültig:", err == nil)
	return string(hashBytes)
}

func BycryptRoute(logger *log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputData := r.FormValue("data")
		if inputData == "" {
			go logger.Println("Fehlende Parameter in BycryptRoute")
			http.Error(w, "Fehlende Parameter", http.StatusBadRequest)
			return
		}

		hash := BycryptHash(inputData, logger)
		writeJsonResponse(logger, w, map[string][]byte{
			"hash": []byte(hash),
		})
	}
}
