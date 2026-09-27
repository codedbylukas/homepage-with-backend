package routesImplementation

import (
	"crypto/sha512"
	"fmt"
	"log"
	"net/http"
)

func getSHA512(data []byte) [64]byte {
	return sha512.Sum512(data)
}

func Sha512Route(logger *log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputData := r.FormValue("data")
		if inputData == "" {
			go logger.Println("Missing parameters in Sha512Route")
			http.Error(w, "Missing parameters", http.StatusBadRequest)
			return
		}

		hash := getSHA512([]byte(inputData))
		writeJsonResponse(logger, w, map[string]string{
			"hash": fmt.Sprintf("%x", hash),
		})
	}
}
