# Build stage - compile frontend
FROM node:20-slim AS build

WORKDIR /app

# Install dependencies
COPY server/package.json server/package-lock.json* ./server/
COPY client/package.json client/package-lock.json* ./client/
RUN cd server && npm install
RUN cd client && npm install

# Build frontend
COPY . .
RUN cd client && npm run build
RUN mkdir -p /app/server/public && cp -R /app/client/dist/* /app/server/public/

# Runtime stage - only Node runtime, no Ollama included
FROM node:20-slim

WORKDIR /app/server
COPY --from=build /app/server /app/server

EXPOSE 5000

# Start the backend only; Ollama should run on the host machine
CMD ["npm", "start"]
