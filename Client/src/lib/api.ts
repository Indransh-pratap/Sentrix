import axios from "axios";

/* ======================================================
   BASE CONFIG (RELATIVE PATHS FOR MONOLITH)
====================================================== */

// When running as a monolith on Railway, the backend is the same origin.
// For local dev with "npm run dev", we still might need the localhost URL if not proxied.
// But simpler: just use relative paths if on same domain, or localhost if strictly local dev split.

const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5000" // Local dev (split)
  : "https://sentrix-backend-8j4r.onrender.com"; // Production (monolith) - relative path

console.log("🔗 API BASE:", API_BASE || "Relative (Same Origin)");

/* ======================================================
   BACKEND – HEALTH
====================================================== */

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${API_BASE}/health`, {
      timeout: 5000,
    });
    return res.status === 200;
  } catch (error) {
    console.error("Health check failed:", error);
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
   BACKEND – PDF REPORT
====================================================== */

export async function downloadReport(scanResult: ScanResult) {
  try {
    const response = await axios.post(
      `${API_BASE}/scan/pdf`,
      scanResult,
      {
        responseType: "blob",
        timeout: 20000,
      }
    );

    const file = new Blob([response.data], {
      type: "application/pdf",
    });

    const fileURL = URL.createObjectURL(file);

    // Open PDF in new tab
    const pdfWindow = window.open();
    if (pdfWindow) {
      pdfWindow.location.href = fileURL;
    }

    // Force download
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `sentrix-report-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("PDF download failed:", error);
    alert("Failed to download PDF report");
  }
}

/* ======================================================
   SECURITY CHAT (BACKEND → GEMINI)
====================================================== */

export async function askSecurityAI(question: string): Promise<string> {
  return askGeminiAI(question);
}

export async function askGeminiAI(question: string): Promise<string> {
  try {
    const res = await axios.post(
      `${API_BASE}/gemini/chat`,
      { message: question },
      { timeout: 20000 }
    );

    if (res.data?.reply) {
      return res.data.reply;
    }

    return "No response from AI.";
  } catch (error) {
    console.error("Gemini request failed:", error);
    return "AI service is currently unavailable.";
  }
}
