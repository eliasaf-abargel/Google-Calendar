# Dockerfile for Frontend
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --ignore-scripts || npm install --no-audit --ignore-scripts
COPY . .
RUN npm run build --if-present && (test -d dist || (test -d build && cp -R build dist) || mkdir -p dist)

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]