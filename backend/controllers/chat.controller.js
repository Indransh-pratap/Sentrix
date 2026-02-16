const axios = require("axios");

exports.chatWithAI = async (req, res) => {
  try {
    const { message, attachment } = req.body;

    // ==============================
    // ✅ Input Validation
    // ==============================
    if ((!message && !attachment) || (message && typeof message !== "string")) {
      return res.status(400).json({
        error: "Valid messages or attachment required"
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "Missing API key"
      });
    }

    // ==============================
    // 🔒 Prompt Injection Protection
    // ==============================
    const restrictedPatterns = [
      "ignore previous instructions",
      "act as",
      "system prompt",
      "developer mode",
      "jailbreak",
      "bypass",
      "override",
      "pretend",
      "simulate",
      "roleplay"
    ];

    const lowerMsg = (message || "").toLowerCase();
    if (restrictedPatterns.some(pattern => lowerMsg.includes(pattern))) {
      return res.status(403).json({
        error: "Potential prompt injection detected."
      });
    }

    // ==============================
    // 🎯 Scope Filter
    // ==============================
    const allowedTopics = [
      "xss","sql","csrf","idor","owasp","vulnerability","security",
      "sentrix","team","hackathon","sih","am hacks","igdtuw","iilm",
      "node","express","python","react","mongodb","api","backend",
      "frontend","deployment","github","jwt","database","docker","ci","cd"
    ];

    if (message && !allowedTopics.some(topic => lowerMsg.includes(topic))) {
      return res.status(403).json({
        error: "Query outside allowed scope."
      });
    }

    // ==============================
    // 📎 Attachment Handling
    // ==============================
    let finalUserMessage = message || "";

    if (attachment && attachment.data) {
      try {
        const base64Data = attachment.data.includes(",")
          ? attachment.data.split(",")[1]
          : attachment.data;

        const decodedText = Buffer.from(base64Data, "base64").toString("utf-8");

        finalUserMessage += `\n\nAttached File:\n${decodedText}\n`;
      } catch (err) {
        console.error("File decode error:", err);
      }
    }

    // ==============================
    // 🛡 Clean Structured System Prompt
    // ==============================
    const systemPrompt = `
You are Sentrix Security Assistant.

Allowed Topics:
- Web security vulnerabilities (XSS, SQL Injection, CSRF, IDOR, OWASP Top 10)
- Sentrix project
- Development stack (Node, React, MongoDB, JWT, Docker, CI/CD)

If question is outside scope, respond exactly:
"This assistant is restricted to Sentrix project, security, and development queries."

Formatting Rules:
- Use short paragraphs
- Use clear section headings:
  Definition:
  Types:
  Impact:
  Prevention:
- Use bullet points when helpful
- Keep answers under 250 words
- No long text blocks
- No markdown symbols like ** or ###
- Professional, clean formatting
`;

    // ==============================
    // 🤖 OpenRouter API Call
    // ==============================
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "stepfun/step-3.5-flash:free",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: finalUserMessage }
        ],
        temperature: 0.3,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 20000
      }
    );

    const aiReply =
      response?.data?.choices?.[0]?.message?.content ||
      "No response generated.";

    return res.status(200).json({
      reply: aiReply.trim()
    });

  } catch (error) {
    console.error("AI Error:", error.response?.data || error.message);

    return res.status(500).json({
      error:
        error.response?.data?.error?.message ||
        "AI request failed"
    });
  }
};
