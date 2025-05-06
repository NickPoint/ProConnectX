# Build stage
FROM node:20-alpine as build

ARG VITE_API_URL
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_API_URL=$VITE_API_URL \
    VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Serve using Nginx
FROM nginx:stable-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: overwrite default nginx.conf
EXPOSE 80