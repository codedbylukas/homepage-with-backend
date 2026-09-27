package routesImplementation

import (
	"crypto/md5"
	"fmt"
	"io"
	"log"
	"net/http"
)

func CreateMd5Hash(text string) string {
 hasher := md5.New()
 _, err := io.WriteString(hasher, text)
 if err != nil {
  log.Println("Error creating MD5 hash: ", err)
 }
 return fmt.Sprintf("%x", hasher.Sum(nil))
}

func Md5Route(w http.ResponseWriter, r *http.Request) {
	inputData := r.FormValue("data")
	if inputData == "" { 
		log.Println("Missing parameters in Md5Route")
		http.Error(w, "Missing parameters", http.StatusBadRequest)
		return
	}

	hash := CreateMd5Hash(inputData)
	writeJsonResponse(w, map[string]string{
		"hash": fmt.Sprintf("%x", hash),
	})
}


