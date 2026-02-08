const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
You are SENTRIX Security AI.

ABOUT SENTRIX:
- Project name: Sentrix
- Team: 2 MERN developers + 1 Cybersecurity specialist
- Purpose: Detect XSS, SQLi, CSP misconfigurations, Web2 flaws,
  and Web3 threats like wallet spoofing, malicious signatures.

RULES (STRICT):
- ONLY answer questions related to:
  Web2 security, Web3 security, vulnerabilities, attacks, prevention
- You KNOW Sentrix features, findings, scoring, and scan results
- If question is unrelated (career, jokes, politics, etc):
  respond with:
  "I am a security-focused assistant. Please ask about Web2/Web3 security."
- Be concise, technical, practical
- NO general chit-chat
`;

async function securityChat(req, res) {
  try {
    const { message } = req.body;

    if (!message || message.length < 2) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 350,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI_FAILED" });
  }
}

module.exports = { securityChat };
