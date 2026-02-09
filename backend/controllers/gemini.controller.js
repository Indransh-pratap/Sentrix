const { GoogleGenerativeAI } = require("@google/generative-ai");

// Minimal local Gemini chat controller (Express LOCAL)
// Matches logic with Vercel serverless function
exports.chatWithGemini = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const { message } = req.body;
    const userMessage = typeof message === 'string' ? message.trim() : '';

    if (!userMessage) {
      return res.status(400).json({ error: 'Invalid request: message is required' });
    }

    // Scope guard
    if (!isInScope(userMessage)) {
      return res.status(200).json({
        reply: 'This assistant is restricted to project and vulnerability-related queries.'
      });
    }

    const systemPrompt =
      'You are the Sentrix Assistant. Only answer questions about the Sentrix project and common web security vulnerabilities (XSS, SQL Injection, CSRF, IDOR, OWASP Top 10). ' +
      'If the user asks anything outside that scope, respond exactly: "This assistant is restricted to project and vulnerability-related queries." ' +
      'Keep responses concise and technical. Do not describe restrictions or training.';

    // Use SDK if available, or fetch. The project has @google/generative-ai installed.
    // We'll use the SDK here for simplicity since it's already set up in the project.
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Understood. I am Sentrix Assistant." }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: "Failed to process security query.", details: String(error) });
  }
};

function isInScope(text) {
  const t = text.toLowerCase();
  const keywords = [
    'hello', 'hi', 'hey', // Added greetings
    'sentrix',
    'xss',
    'cross-site scripting',
    'sql injection',
    'sqli',
    'csrf',
    'cross-site request forgery',
    'idor',
    'insecure direct object reference',
    'owasp',
    'owasp top',
    'vulnerability',
    'security',
    'pentest',
    'scan',
    'exploit'
  ];
  return keywords.some(k => t.includes(k));
}