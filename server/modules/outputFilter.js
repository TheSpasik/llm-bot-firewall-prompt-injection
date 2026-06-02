const dangerousOutputPatterns = [
  "system prompt",
  "internal instruction",
  "internal rules",
  "hidden prompt",
  "hidden instructions",
  "admin password",
  "secret key",
  "api key",
  "confidential data",
  "private token",
  "developer message",
  "root access",
  "system message"
];

function filterOutput(botReply) {
  const normalized = (botReply || '').toLowerCase();
  for (const pattern of dangerousOutputPatterns) {
    if (normalized.includes(pattern)) {
      return {
        finalReply: 'The response was blocked by the security system because it may contain internal or confidential information.',
        outputBlocked: true,
        reason: `Detected dangerous output pattern: ${pattern}`
      };
    }
  }

  return {
    finalReply: botReply,
    outputBlocked: false,
    reason: 'Output is safe.'
  };
}

module.exports = { filterOutput };
