# Build stage
FROM node:20-alpine as build

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve using Nginx
FROM nginx:stable-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: overwrite default nginx.conf
EXPOSE 80