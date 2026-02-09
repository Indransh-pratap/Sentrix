import axios from "axios";

/* ======================================================
   BASE CONFIG
====================================================== */

const API_BASE = "https://sentrix-backend-8j4r.onrender.com";

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
  // Use axios to call our own backend
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
