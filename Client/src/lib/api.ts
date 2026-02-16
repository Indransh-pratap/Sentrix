import axios from "axios";

/*
=====================================
  BASE CONFIG
=====================================
*/

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "";

console.log("🔗 API BASE:", API_BASE || "Relative (Same Origin)");

/*
=====================================
  HEALTH
=====================================
*/

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await axios.get(`${API_BASE}/health`, {
      timeout: 5000,
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

/*
=====================================
  SCAN
=====================================
*/

export async function scanWebsite(url: string) {
  const response = await axios.post(`${API_BASE}/api/scan`, { url });
  return response.data;
}

/*
=====================================
  PDF
=====================================
*/

export async function downloadReport(scanResult: any) {
  try {
    const response = await axios.post(
      `${API_BASE}/api/scan/pdf`,
      scanResult,
      { responseType: "blob" }
    );

    const file = new Blob([response.data], {
      type: "application/pdf",
    });

    const fileURL = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `sentrix-report-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("PDF download failed:", error);
  }
}

/*
=====================================
  CHAT
=====================================
*/

export async function askSecurityAI(
  question: string,
  attachment?: any
): Promise<string> {
  try {
    const res = await axios.post(
      `${API_BASE}/api/chat`,
      { message: question, attachment },
      { timeout: 30000 }
    );

    return res.data?.reply || "No response from AI.";
  } catch (error: any) {
    return (
      error?.response?.data?.error ||
      "AI service is currently unavailable."
    );
  }
}
