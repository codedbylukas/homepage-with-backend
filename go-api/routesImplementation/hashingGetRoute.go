package routesImplementation

import (
	"log"
	"net/http"
)

func AnswerGetHashingRoute(logger *log.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		const answerText string = "Dieser Endpoint ist ausschließlich für POST-Requests gedacht. Nutze diesen Endpoint bitte mit POST."
		
		logger.Print("Der GET-Endpoint für Hashing wurde aufgerufen")
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte(answerText))
	}
}
