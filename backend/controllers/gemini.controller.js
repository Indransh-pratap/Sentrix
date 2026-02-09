// Minimal local Gemini chat controller (Express LOCAL)
// Uses native fetch to match Vercel serverless logic exactly
exports.chatWithGemini = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
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

    // Use REST API directly (Node 18+ has global fetch)
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt + '\n\nUser: ' + userMessage }]
        }
      ]
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error("Gemini API Error:", errText);
      return res.status(502).json({ error: 'Gemini request failed', details: errText });
    }

    const data = await r.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'This assistant is restricted to project and vulnerability-related queries.';

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