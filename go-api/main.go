package main

import (
	"go-api/routes"
	"log"
)

func main() {
	if err := routes.SetupRoutes(); err != nil {
		go log.Fatal(err)
	}
}
