const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { analyzeInput } = require("./modules/securityFilter");
const { filterOutput } = require("./modules/outputFilter");
const { generateOllamaResponse } = require("./modules/ollamaLLM");
const { getProducts } = require("./modules/productService");
const {
  addSecurityLog,
  getSecurityLogs,
  clearSecurityLogs,
} = require("./modules/logger");
const { maliciousTests, normalTests } = require("./tests/attackTests");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const model = process.env.OLLAMA_MODEL || "llama3.2:3b";
let host = process.env.OLLAMA_HOST || "http://localhost:11434";
if (!host.startsWith("http://") && !host.startsWith("https://")) {
  host = "http://" + host;
}

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function createLogEntry({
  userMessage,
  classification,
  reason,
  detectedPattern,
  action,
}) {
  return {
    timestamp: new Date().toISOString(),
    userMessage,
    classification,
    reason,
    detectedPattern: detectedPattern || null,
    action,
  };
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/products", (req, res) => {
  const products = getProducts();
  res.json(products);
});

app.post("/api/chat", async (req, res) => {
  const userMessage = (req.body.message || "").toString().trim();
  if (!userMessage) {
    return res.status(400).json({
      reply: "Please provide a valid message for the shop assistant.",
      classification: "safe",
      blocked: false,
      reason: "Message is empty or invalid.",
      outputBlocked: false,
    });
  }

  const analysis = analyzeInput(userMessage);

  // Handle non-English language
  if (analysis.classification === "non-english") {
    addSecurityLog(
      createLogEntry({
        userMessage,
        classification: analysis.classification,
        reason: analysis.reason,
        detectedPattern: analysis.detectedPattern,
        action: "blocked",
      }),
    );

    return res.json({
      reply:
        "Sorry, I'm not able to understand this language. Can you please write it one more time in English?",
      classification: "non-english",
      blocked: true,
      reason: analysis.reason,
      outputBlocked: false,
    });
  }

  if (analysis.classification === "malicious") {
    addSecurityLog(
      createLogEntry({
        userMessage,
        classification: analysis.classification,
        reason: analysis.reason,
        detectedPattern: analysis.detectedPattern,
        action: "blocked",
      }),
    );

    return res.json({
      reply:
        "Your request looks like a prompt injection attempt. I cannot execute commands aimed at bypassing security rules, but I can help you choose products from the store catalog.",
      classification: "malicious",
      blocked: true,
      reason: analysis.reason,
      outputBlocked: false,
    });
  }

  const products = getProducts();
  const botReply = await generateOllamaResponse(
    userMessage,
    products,
    analysis.classification,
  );
  const outputCheck = filterOutput(botReply);

  if (analysis.classification === "suspicious") {
    addSecurityLog(
      createLogEntry({
        userMessage,
        classification: analysis.classification,
        reason: analysis.reason,
        detectedPattern: analysis.detectedPattern,
        action: "suspicious",
      }),
    );
  }

  if (outputCheck.outputBlocked) {
    addSecurityLog(
      createLogEntry({
        userMessage,
        classification: analysis.classification,
        reason: outputCheck.reason,
        detectedPattern: null,
        action: "output_blocked",
      }),
    );
  }

  res.json({
    reply: outputCheck.finalReply,
    classification: analysis.classification,
    blocked: false,
    reason: analysis.reason,
    outputBlocked: outputCheck.outputBlocked,
  });
});

app.get("/api/logs", (req, res) => {
  const logs = getSecurityLogs();
  res.json(logs);
});

app.post("/api/logs/clear", (req, res) => {
  clearSecurityLogs();
  res.json({ message: "Security logs cleared." });
});

app.post("/api/test-attacks", (req, res) => {
  const results = [];
  let blocked = 0;
  let missed = 0;

  maliciousTests.forEach((message) => {
    const analysis = analyzeInput(message);
    const passed = analysis.classification !== "safe";
    if (analysis.classification !== "safe") {
      blocked += 1;
    }
    if (analysis.classification === "safe") {
      missed += 1;
    }
    results.push({
      test: message,
      expected: "malicious",
      actual: analysis.classification,
      detectedPattern: analysis.detectedPattern,
      pass: passed,
    });
  });

  normalTests.forEach((message) => {
    const analysis = analyzeInput(message);
    const pass = analysis.classification === "safe";
    results.push({
      test: message,
      expected: "safe",
      actual: analysis.classification,
      detectedPattern: analysis.detectedPattern,
      pass,
    });
  });

  res.json({
    totalTests: results.length,
    blocked,
    missed,
    results,
  });
});

app.get("/api/ollama/status", async (req, res) => {
  const status = { available: false, model, host };

  try {
    if (typeof fetch === "function") {
      const response = await fetch(`${host}/v1/models`);
      if (!response.ok) {
        throw new Error(`Ollama status endpoint returned ${response.status}`);
      }
      const data = await response.json();
      const models = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
      if (models.some((item) => item.id === model || item.name === model)) {
        status.available = true;
      } else if (models.length > 0) {
        status.available = true;
        status.warning =
          "Ollama is reachable but the model was not found in the list response.";
      }
    }
  } catch (error) {
    status.error = error.message || "Connection refused or model unavailable";
  }

  res.json(status);
});

const clientDistPath = path.join(__dirname, "public");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "Not found" });
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Secure Local LLM Shop Assistant API is running on port ${port}`);
});
