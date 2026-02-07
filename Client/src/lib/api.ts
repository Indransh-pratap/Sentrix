import axios from "axios";

/* ======================================================
   BASE CONFIG
====================================================== */

const API_BASE = "http://localhost:5000";

/* ======================================================
   BACKEND – HEALTH
====================================================== */

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${API_BASE}/health`, { timeout: 5000 });
    return res.status === 200;
  } catch {
    return false;
  }
}

/* ======================================================
   BACKEND – SCAN (SOURCE OF TRUTH)
====================================================== */

export interface ScanFinding {
  title: string;
  severity: string;
  walletImpact?: string;
  confidenceImpact?: string;
  detail?: string;
  summary?: string;
  fix?: string;
}

export interface ScanResult {
  target: string;
  time: string;
  score?: number;
  findings: ScanFinding[];
  aiExplanation?: string;
}

export async function scanWebsite(url: string): Promise<ScanResult> {
  const response = await axios.post(`${API_BASE}/scan`, { url });
  return response.data; // 🔥 backend ka exact response
}

/* 
OPTIONAL (future use)
Only if you later switch to scanId based flow
*/
export async function fetchScanResult(scanId: string): Promise<ScanResult> {
  const response = await axios.get(`${API_BASE}/scan/${scanId}`);
  return response.data;
}

/* ======================================================
   FRONTEND – SECURITY CHAT (OPENAI ONLY)
   ❌ NO BACKEND DEPENDENCY
====================================================== */

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `
You are Web3Guard, a frontend security assistant.
Explain Web2, Web3, XSS, CSP, wallet spoofing clearly.
If input is random, ask politely for a security question.
Be concise, technical, and practical.
`;

export async function askSecurityAI(question: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question },
      ],
    }),
  });

  if (res.status === 429) {
    throw new Error("RATE_LIMIT");
  }

  if (!res.ok) {
    throw new Error("OPENAI_FAILED");
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
