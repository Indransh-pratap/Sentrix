import axios from "axios";

/* ======================================================
   BASE CONFIG
====================================================== */

// Uses VITE_API_BASE from .env files
// .env.local -> http://localhost:5000/api
// .env.production -> https://sentrix-backend.vercel.app/api
const API_BASE = import.meta.env.VITE_API_BASE;

if (!API_BASE) {
  console.error("VITE_API_BASE is missing! Check your .env configuration.");
}

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
  // Legacy/Web3 specific fields
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
  return response.data; // 🔥 backend ka exact response
}

export async function downloadReport(scanResult: ScanResult) {
  try {
    const response = await axios.post(`${API_BASE}/scan/pdf`, scanResult, {
      responseType: 'blob', // Important for binary data
    });
    
    // Create a Blob from the PDF Stream
    const file = new Blob([response.data], { type: 'application/pdf' });
    
    // Build a URL from the file
    const fileURL = URL.createObjectURL(file);
    
    // Open the URL on new Window
    const pdfWindow = window.open();
    if (pdfWindow) {
      pdfWindow.location.href = fileURL;
    }
    
    // Optional: Trigger download directly
    const link = document.createElement('a');
    link.href = fileURL;
    link.setAttribute('download', `sentrix-report-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("PDF Download failed:", error);
    alert("Failed to download PDF report");
  }
}

/* ======================================================
   FRONTEND – SECURITY CHAT (BACKEND RELAY)
   ✅ SECURE: Calls backend, backend calls OpenAI
====================================================== */

export async function askSecurityAI(question: string): Promise<string> {
  // Now simply redirects to Gemini
  return askGeminiAI(question);
}

// New Gemini Chat Function
export async function askGeminiAI(question: string): Promise<string> {
  const res = await axios.post(
    `${API_BASE}/gemini/chat`,
    { message: question },
    { timeout: 20000 }
  );

  if (res.data.reply) {
    return res.data.reply;
  }
  
  throw new Error("GEMINI_FAILED");
}
