# Full Stack Application: Angular + .NET + C++ + Go

This project combines an Angular frontend with four separate backend services that are orchestrated through Docker Compose. The app demonstrates how a single frontend can interact with different technologies for distinct tasks:

- C# backend for persistent shopping list data
- C++ Crow backend for random numbers and encoding/decoding utilities
- Go backend for hashing and comment APIs
- Angular frontend served with Nginx as a single entry point

## Overview

### Components

- Frontend: Angular app served via Nginx on port 80
- C# API: .NET Web API on port 5202
- C++ API: Crow service on port 10000
- Go API: chi-based HTTP server on port 8080

### Features

- Shopping list CRUD with LiteDB
- Hash generation for MD5, SHA1, SHA256, SHA512, Argon2, Bcrypt, and Blake2b
- Text encoding and decoding with Base64, Base32, Base85, Hex, and ROT13
- Random number generation
- Comment storage API for the Go service

## Prerequisites

- Docker
- Docker Compose
- Node.js + npm (for local Angular development)
- .NET SDK (for local C# API work)
- Go toolchain (for local Go service development)
- C++ compiler (for local C++ service compilation)

## Quick Start

Start the full stack with Docker:

```bash
docker compose up --build
```

Then open the app in the browser:

```text
http://localhost
```

The frontend routes requests to the backend services through the Nginx proxy configuration. The internal Docker network used by the stack is `homepage-network`.

## Local Frontend Development

If you only want to work on the Angular app locally, start the backend containers and then run the frontend separately:

```bash
docker-compose up -d
cd frontend
npm install
npm start
```

The Angular dev server usually runs on:

```text
http://localhost:4200
```

## Container Configuration

The Compose file defines the following services:

- `homepage-frontend` -> port 80
- `homepage-backend-cs` -> port 5202
- `homepage-backend-cpp` -> port 10000
- `homepage-backend-go` -> port 8080

## API Routes

### C# Shopping List API

Base URL: `/api/cs`

| Method | Route                            | Description                     |
| ------ | -------------------------------- | ------------------------------- |
| GET    | `/api/cs/shoppinglist`           | Returns all shopping list items |
| POST   | `/api/cs/shoppinglist?name=Milk` | Adds a new item                 |
| DELETE | `/api/cs/shoppinglist/{id}`      | Removes one item by ID          |
| DELETE | `/api/cs/shoppinglist/all`       | Removes all items               |

### C++ Encoding / Utility API

Base URL: `/api/cpp`

| Method | Route                                 | Description                    |
| ------ | ------------------------------------- | ------------------------------ |
| GET    | `/api/cpp/random`                     | Returns a random integer       |
| GET    | `/api/cpp/encode/to-base64/{value}`   | Encodes a value to Base64      |
| GET    | `/api/cpp/encode/from-base64/{value}` | Decodes Base64                 |
| GET    | `/api/cpp/encode/to-hex/{value}`      | Encodes a value to hexadecimal |
| GET    | `/api/cpp/encode/from-hex/{value}`    | Decodes hexadecimal            |
| GET    | `/api/cpp/encode/to-rot13/{value}`    | Applies ROT13                  |
| GET    | `/api/cpp/encode/to-base32/{value}`   | Encodes to Base32              |
| GET    | `/api/cpp/encode/to-base85/{value}`   | Encodes to Base85              |

### Go Hashing and Comments API

Base URL: `/api/go`

| Method     | Route                      | Description                                  |
| ---------- | -------------------------- | -------------------------------------------- |
| GET        | `/api/go/comments`         | Returns all comments                         |
| POST       | `/api/go/comments`         | Adds a comment                               |
| GET / POST | `/api/go/hash/{algorithm}` | Hashes a payload with the selected algorithm |

Supported algorithms:

- `md5`
- `sha1`
- `sha256`
- `sha512`
- `argon2`
- `blake2b`
- `bcrypt`

## Project Structure

```text
.
├── api-cs/                  # .NET backend for the shopping list
│   ├── Controllers/
│   ├── Models/
│   ├── Dockerfile
│   ├── Program.cs / main.cs
│   └── ...
├── cpp-api-crow/            # C++ Crow API for encoding and utility routes
│   ├── include/
│   ├── src/
│   ├── Dockerfile
│   └── Makefile
├── go-api/                  # Go backend for hashing and comments
│   ├── routes/
│   ├── routesImplementation/
│   ├── Dockerfile
│   ├── go.mod
│   └── main.go
├── frontend/                # Angular frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── angular.json
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml       # Multi-container orchestration
├── README.md
└── ...
```

## Testing

### Frontend

The Angular project includes a test setup via Angular CLI/Vitest:

```bash
cd frontend
npm run test
```

### Backend

There are no dedicated automated tests checked into the repository for the .NET, Go, or C++ services in the current state of the project. The focus here is on working containerized services and frontend integration.

## Notes

- The frontend service uses an Nginx reverse proxy and exposes the app at port 80.
- Each backend service writes logs to mounted folders such as `webserver-logs`, `cs-api-server-logs`, `cpp-api-server-logs`, and `go-api-server-logs`.
- The frontend code references endpoint helpers through `frontend/src/app/api-endpints.ts`.

## Useful Commands

```bash
# build and run the full stack
docker compose up --build

# stop all containers
docker compose down

# rebuild only the frontend
docker compose build homepage-frontend

# run backend services only
docker compose up -d homepage-backend-cs homepage-backend-cpp homepage-backend-go
```
