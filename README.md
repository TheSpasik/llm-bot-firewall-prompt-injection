# Secure Local LLM Shop Assistant with Prompt Injection Protection

## What this is

Secure Local LLM Shop Assistant is a course project that demonstrates a secure, local LLM-powered chatbot for an electronics store. It includes input filtering, output filtering, security logging, and a small test suite to demonstrate protection against prompt injection.

## Key components

- Frontend: React (Vite) UI with Chat, Products, Attack Tester, and Logs pages.
- Backend: Node.js + Express API that filters input, calls a local Ollama instance, filters output, and logs suspicious activity.
- Local LLM: Ollama + a local model (recommended `llama3.2:3b`).

## Prerequisites

- Node.js 18+ and npm
- Ollama installed on your host machine (not required inside Docker for the app-only container)

## Start locally (recommended for development)

1. Install and run Ollama on your machine and pull a model:

```bash
ollama pull llama3.2:3b
ollama run llama3.2:3b
```

2. Backend:

```bash
cd server
npm install
npm start
```

3. Frontend (dev):

```bash
cd client
npm install
npm run dev
```

4. Open the frontend at `http://localhost:5173` (Vite default) or the backend at `http://localhost:5000`.

## Start with Docker (app only)

This starts only the Node app in a container. Ollama must run on your host for the container to reach it.

```bash
docker-compose build
docker-compose up
```

The container connects to host Ollama at `http://host.docker.internal:11434` by default.

Open the app at `http://localhost:5000`.

