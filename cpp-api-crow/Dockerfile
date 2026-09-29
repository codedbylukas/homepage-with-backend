# --- Build Stage ---
FROM ubuntu:latest AS builder

ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /cpp-app

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    make \
    cmake \
    curl \
    git \
    ca-certificates \
    libboost-dev \
    libssl-dev \
    libasio-dev \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN chmod +x ./get-crow.sh && ./get-crow.sh

# Statisches Linken erzwingen. Als Make-Argument überschreibt LDFLAGS
# die Standarddefinition im Makefile zuverlässig.
RUN make clean && make -j$(nproc) \
    LDFLAGS="-static -static-libgcc -static-libstdc++ -flto=auto -pthread -s"

# Zertifikate für HTTPS-Calls bereitstellen
RUN update-ca-certificates

# --- Final Stage (Scratch) ---
FROM scratch AS final

WORKDIR /app

COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=builder /cpp-app/app /app/app

EXPOSE 10000

ENTRYPOINT [ "/app/app" ]

