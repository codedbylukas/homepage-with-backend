# --- STAGE 1: Build & Publish ---
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet build --no-restore
RUN dotnet publish -c Release -o /app/publish --no-restore

# --- STAGE 2: Runtime ---
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5202
ENV ASPNETCORE_URLS=http://0.0.0.0:5202

ENTRYPOINT [ "dotnet", "api.dll" ]
