package routesImplementation

import (
	"crypto/md5"
	"fmt"
	"io"
	"net/http"
)

func CreateMd5Hash(text string) string {
 hasher := md5.New()
 _, err := io.WriteString(hasher, text)
 if err != nil {
  panic(err)
 }
 return fmt.Sprintf("%x", hasher.Sum(nil))
}

func Md5Route(w http.ResponseWriter, r *http.Request) {
	inputData := r.FormValue("data")
	if inputData == "" {
		http.Error(w, "Missing parameters", http.StatusBadRequest)
		return
	}

	hash := CreateMd5Hash(inputData)
	writeJsonResponse(w, map[string]string{
		"hash": fmt.Sprintf("%x", hash),
	})
}


