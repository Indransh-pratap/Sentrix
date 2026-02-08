import axios from "axios";

/* ======================================================
   BASE CONFIG
====================================================== */

// 👉 Local OR deployed backend
const API_BASE = "http://localhost:5000";
// const API_BASE = "https://your-backend.onrender.com";

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
  impact?: string;
  detail?: string;
  fix?: string;
  url?: string;

  // Web3 / legacy
  walletImpact?: string;
  confidenceImpact?: string;
  summary?: string;
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
  return response.data;
}

/* ======================================================
   FRONTEND → BACKEND → AI (SECURE)
====================================================== */

export async function askSecurityAI(question: string): Promise<string> {
  const res = await axios.post(
    `${API_BASE}/api/ai/chat`,
    { message: question },
    { timeout: 15000 }
  );

  if (!res.data?.reply) {
    throw new Error("AI_FAILED");
  }

  return res.data.reply;
}
