export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  // Allow localhost and production domains
  const allowedOrigins = [
    'http://localhost:5173', 
    process.env.FRONTEND_ORIGIN
  ].filter(Boolean);

  // Set CORS headers
  if (allowedOrigins.includes(origin) || !origin) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
    }

    const body = req.body || {};
    const userMessage = typeof body.message === 'string' ? body.message.trim() : '';

    if (!userMessage) {
      return res.status(400).json({ error: 'Invalid request: message is required' });
    }

    // Scope guard: only project/vulnerability topics allowed
    const scopeAllowed = isInScope(userMessage);
    if (!scopeAllowed) {
      return res.status(200).json({
        reply: 'This assistant is restricted to project and vulnerability-related queries.'
      });
    }

    const systemPrompt =
      'You are the Sentrix Assistant. Only answer questions about the Sentrix project and common web security vulnerabilities (XSS, SQL Injection, CSRF, IDOR, OWASP Top 10). ' +
      'If the user asks anything outside that scope, respond exactly: "This assistant is restricted to project and vulnerability-related queries." ' +
      'Keep responses concise and technical. Do not describe restrictions or training.';

    // Inject system prompt before user message (REST call)
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + encodeURIComponent(apiKey);

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
      return res.status(502).json({ error: 'Gemini request failed', details: errText });
    }

    const data = await r.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'This assistant is restricted to project and vulnerability-related queries.';

    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({ error: 'Server error', details: String(e) });
  }
}

function isInScope(text) {
  const t = text.toLowerCase();
  const keywords = [
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