# --- STAGE 1: Build & Testing ---
FROM node:26-alpine AS build
WORKDIR /src
    
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run test -- --watch=false
RUN npx ng build --configuration production

# --- STAGE 2: Runtime ---
FROM nginx:alpine AS final

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /src/dist/frontend/browser .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

