package routesImplementation

import (
	"fmt"
	"log"
	"net/http"

	"golang.org/x/crypto/blake2b"
)

func Blake2bHash(data []byte) []byte {
	hash := blake2b.Sum256(data)
	return hash[:]
}

func Blake2bRoute(logger *log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputData := r.FormValue("data")
		if inputData == "" {
			go logger.Println("Missing parameters in Blake2bRoute")
			http.Error(w, "Missing parameters", http.StatusBadRequest)
			return
		}

		hash := Blake2bHash([]byte(inputData))
		writeJsonResponse(logger, w, map[string]string{
			"hash": fmt.Sprintf("%x", hash),
		})
	}
}


