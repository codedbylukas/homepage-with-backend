package routesImplementation

import (
	"log"
	"net/http"

	"golang.org/x/crypto/argon2"
)

func Argon2Hash(text string, logger *log.Logger) []byte {
	pass := []byte(text)
	hashBytes := argon2.IDKey(pass, []byte{}, 1, 64*1024, 4, 32)
	
	logger.Printf("Hash: %x\n", hashBytes)
	return hashBytes
}


func Argon2Route(logger *log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputData := r.FormValue("data")
		if inputData == "" {
			go logger.Println("Fehlende Parameter in Argon2Route")
			http.Error(w, "Fehlende Parameter", http.StatusBadRequest)
			return
		}

		hash := Argon2Hash(inputData, logger)
		writeJsonResponse(logger, w, map[string][]byte{
			"hash": hash,
		})
	}
}

