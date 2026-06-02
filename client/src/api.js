const BASE_URL = 'http://localhost:5000';

export async function sendMessage(message) {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${BASE_URL}/api/products`);
  return response.json();
}

export async function getLogs() {
  const response = await fetch(`${BASE_URL}/api/logs`);
  return response.json();
}

export async function clearLogs() {
  const response = await fetch(`${BASE_URL}/api/logs/clear`, { method: 'POST' });
  return response.json();
}

export async function runAttackTests() {
  const response = await fetch(`${BASE_URL}/api/test-attacks`, { method: 'POST' });
  return response.json();
}

export async function getOllamaStatus() {
  const response = await fetch(`${BASE_URL}/api/ollama/status`);
  return response.json();
}
