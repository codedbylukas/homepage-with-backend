package routesImplementation

import (
	"crypto/sha256"
	"fmt"
	"log"
	"net/http"
)

func getsha256(data []byte) [32]byte {
	return sha256.Sum256([]byte(data))
}

func Sha256Route(w http.ResponseWriter, r *http.Request) {
	inputData := r.FormValue("data")
	if inputData == "" {
		log.Println("Missing parameters in Sha256Route")
		http.Error(w, "Missing parameters", http.StatusBadRequest)
		return
	}

	hash := getsha256([]byte(inputData))
	writeJsonResponse(w, map[string]string{
		"hash": fmt.Sprintf("%x", hash),
	})
}

