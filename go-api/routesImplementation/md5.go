package routesImplementation

import (
	"crypto/md5"
	"fmt"
	"io"
	"log"
	"net/http"
)

func CreateMd5Hash(text string) string {
	return createMd5Hash(log.Default(), text)
}

func createMd5Hash(logger *log.Logger, text string) string {
	hasher := md5.New()
	_, err := io.WriteString(hasher, text)
	if err != nil {
		logger.Println("Error creating MD5 hash: ", err)
	}
	return fmt.Sprintf("%x", hasher.Sum(nil))
}

func Md5Route(logger *log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		inputData := r.FormValue("data")
		if inputData == "" {
			logger.Println("Missing parameters in Md5Route")
			http.Error(w, "Missing parameters", http.StatusBadRequest)
			return
		}

		hash := createMd5Hash(logger, inputData)
		writeJsonResponse(logger, w, map[string]string{
			"hash": fmt.Sprintf("%x", hash),
		})
	}
}
