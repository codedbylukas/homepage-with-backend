FROM ubuntu:latest AS build
WORKDIR /src
COPY go.mod ./
COPY go.sum ./
RUN apt-get update && apt-get install -y golang-go ca-certificates && update-ca-certificates
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -buildmode=exe -trimpath -ldflags="-w -s" -o api
FROM scratch AS publish
COPY --from=build /src/api /api
EXPOSE 8080
ENTRYPOINT ["/api"]

