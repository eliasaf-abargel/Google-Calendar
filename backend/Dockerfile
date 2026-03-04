# Dockerfile for Backend
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --ignore-scripts || npm install --no-audit --ignore-scripts
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
