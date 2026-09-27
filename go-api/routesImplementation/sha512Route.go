package routesImplementation

import (
	"crypto/sha512"
	"fmt"
	"net/http"
)

func getSHA512(data []byte) [64]byte {
	return sha512.Sum512(data)
}

func Sha512Route(w http.ResponseWriter, r *http.Request) {
	inputData := r.FormValue("data")
	if inputData == "" {
		http.Error(w, "Missing parameters", http.StatusBadRequest)
		return
	}

	hash := getSHA512([]byte(inputData))
	writeJsonResponse(w, map[string]string{
		"hash": fmt.Sprintf("%x", hash),
	})
}

