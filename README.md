# Full Stack Application: C++ / .NET / Go Backend with Angular Frontend

This project is a comprehensive full-stack application featuring an Angular frontend and three distinct microservices written in C#, C++, and Go, orchestrated using Docker Compose. The system provides diverse functionalities including data persistence (Shopping List via C# backend), advanced cryptographic operations (encoding/decoding via C++ backend), and hashing services (via Go backend).

## Project Overview

The application is designed to demonstrate the integration of multiple technologies:

- **Frontend:** An Angular application providing a user interface for interacting with various features.
- **Backend Services:**
  - **C# API (`api-cs`):** Manages persistent data (Shopping List) using LiteDB.
  - **C++ API (`cpp-api-crow`):** Provides custom cryptographic encoding and decoding functions (Base64, Hex, ROT13, Base32, Base85).
  - **Go API (`go-api`):** Implements hashing algorithms (MD5, SHA512).
- **Orchestration:** All services are deployed and networked together using Docker Compose and proxied by Nginx.

## Prerequisites

### Primary Requirements (Required for Full Stack Deployment)

- Docker
- Docker Compose

### Local Development & Debugging (Optional but Recommended)

- Node.js / npm (for Angular development)
- Go (for Go API debugging)
- C++ Compiler (g++) (for C++ API compilation)
- .NET SDK (for C# API development)

## Setup and Installation

You have two primary ways to run the project:

### Option A: Quick Start via Docker (Recommended for Deployment)

This method builds all services and deploys them in a single command, making it ideal for immediate testing and deployment.

```bash
docker-compose up --build
```

The application will be accessible on `http://localhost` (via Nginx).

### Option B: Local Frontend Development

Use this method if you need to modify the Angular code or debug specific services locally outside of Docker.

1.  **Build Backend Services:** Start the Docker Compose stack to ensure backend services are running.
    ```bash
    docker-compose up -d
    ```
2.  **Install Frontend Dependencies:** Navigate to the frontend directory and install Node.js packages.
    ```bash
    cd frontend
    npm install
    ```
3.  **Run Frontend Server:** Start the Angular development server.
    ```bash
    npm start
    ```

## Running the Project

### Full Stack Execution (Docker)

Use `docker-compose up --build` to build all images and start the containerized application stack on `http://localhost`.

### Local Frontend Development (NPM)

For local Angular development, follow the steps in Option B:

1.  Ensure Docker Compose is running (`docker-compose up -d`).
2.  Navigate to `frontend` and run `npm start`.

## API Endpoints and Usage

The frontend interacts with the backend services via Nginx proxy routing defined in `frontend/nginx.conf`.

| Endpoint Path | Service                      | Port Mapped | Functionality                        | Example Request (Frontend)                                                                                  |
| :------------ | :--------------------------- | :---------- | :----------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| `/api/cs/*`   | `homepage-backend-cs` (C#)   | 5202        | Shopping List CRUD operations.       | `GET /api/cs/shoppinglist` <br> `POST /api/cs/shoppinglist?name=Milch` <br> `DELETE /api/cs/shoppinglist/3` |
| `/api/cpp/*`  | `homepage-backend-cpp` (C++) | 10000       | Cryptographic encoding and decoding. | `GET /api/cpp/encode/to-base64/text` <br> `GET /api/cpp/encode/from-base64/encoded_text`                    |
| `/api/go/*`   | `homepage-backend-go` (Go)   | 8080        | Hashing services (MD5, SHA512).      | `POST /api/go/hash/sha512` <br> `POST /api/go/hash/md5`                                                     |

**Example Frontend Interactions:**

- **Hashing:** The Hashing component calls the Go API for hashing operations. Endpoint: `/api/go/hash/{algorithm}`.
- **Encoding:** The Encoding component calls the C++ API for various encoding/decoding methods. Endpoint format: `/api/cpp/encode/{mode}-{algorithm}/{text}`.

## Project Structure

The project is structured into four main components and an orchestration file:

```
.
├── api-cs/                 # .NET Web API (C#) for Shopping List management
│   ├── Dockerfile
│   └── ...
├── cpp-api-crow/           # C++ Crow API for cryptographic operations (encoding/decoding)
│   ├── Dockerfile
│   └── src/
├── go-api/                 # Go API for hashing services (MD5, SHA512)
│   ├── Dockerfile
│   └── routes/
├── frontend/               # Angular application (Frontend UI)
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── api-endpints.ts       # API interaction definitions
│       │   ├── hashing/             # Hashing functionality UI
│       │   ├── encoding/            # Encoding/Decoding functionality UI
│       │   └── shopping-list/       # Shopping List management UI
│       └── ...
└── docker-compose.yml       # Defines the multi-service network structure
```

## Testing

### Frontend (Angular)

Unit and end-to-end tests are managed via the Angular CLI and Vitest:

```bash
cd frontend
npm run test
```

### Backend Services

- **C# API (`api-cs`):** Tests are not explicitly defined, but the service uses Serilog for logging.
- **Go API (`go-api`):** Unit testing is not explicitly defined.
- **C++ API (`cpp-api-crow`):** The Makefile includes a build process focused on maximum performance (PGO), indicating emphasis on optimized compilation rather than extensive unit test coverage in the provided files.

## Configuration Details

### Docker Compose Network

All services communicate over a private bridge network named `homepage-network`.

### Frontend Proxy Configuration (`frontend/nginx.conf`)

Nginx routes all API requests to the correct backend service:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location /api/cs/ {
        proxy_pass http://homepage-backend-cs:5202;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/cpp/ {
        proxy_pass http://homepage-backend-cpp:10000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/go/ {
        proxy_pass http://homepage-backend-go:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
