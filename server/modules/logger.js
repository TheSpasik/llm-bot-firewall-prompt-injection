const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, '..', 'data', 'security_logs.json');

function ensureLogFile() {
  const logDir = path.dirname(logFilePath);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '[]', 'utf-8');
  }
}

function readLogs() {
  ensureLogFile();
  const raw = fs.readFileSync(logFilePath, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function addSecurityLog(entry) {
  const logs = readLogs();
  logs.push(entry);
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2), 'utf-8');
}

function getSecurityLogs() {
  return readLogs();
}

function clearSecurityLogs() {
  ensureLogFile();
  fs.writeFileSync(logFilePath, '[]', 'utf-8');
}

module.exports = { addSecurityLog, getSecurityLogs, clearSecurityLogs };
