package routesImplementation

import (
	"encoding/json"
	"net/http"
)

func writeJsonResponse(w http.ResponseWriter, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	jsonData, err := json.Marshal(data)
	if err != nil {
		http.Error(w, "Error encoding JSON response", http.StatusInternalServerError)
		return
	}
	w.Write(jsonData)
}

