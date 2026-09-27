package routesImplementation

import (
	"crypto/sha1"
	"encoding/hex"
	"log"
	"net/http"
)

func CreateSha1Hash(text string) string {
	data := []byte(text)
    hash := sha1.New()
    hash.Write(data)
    hashedData := hash.Sum(nil)
    hashedString := hex.EncodeToString(hashedData)
    return hashedString
}

func Sha1Route(w http.ResponseWriter, r *http.Request) {
	inputData := r.FormValue("data")
	if inputData == "" {
		log.Println("Missing parameters in Sha1Route")
		http.Error(w, "Missing parameters", http.StatusBadRequest)
		return
	}

	hash := CreateSha1Hash(inputData)
	writeJsonResponse(w, map[string]string{
		"hash": hash,
	})
}
