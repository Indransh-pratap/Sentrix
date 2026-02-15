import { motion } from "framer-motion";
import { Search, ArrowRight, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScanTerminal } from "../components/ScanTerminal";
import { BackendError } from "../components/BackendError";
import { scanWebsite, checkBackendHealth } from "../lib/api";

export function ScanPage() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [backendError, setBackendError] = useState(false);

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing security checks");

  const navigate = useNavigate();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setScanning(true);
    setBackendError(false);

    setProgress(5);
    setStatus("Connecting to security engine");

    const backendOk = await checkBackendHealth();
    if (!backendOk) {
      setScanning(false);
      setBackendError(true);
      return;
    }

    try {
      setStatus("Analyzing frontend assets");
      
      // Simulate smoother progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 800);

      const scanResult = await scanWebsite(url.trim());
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus("Finalizing report");

      setTimeout(() => {
        navigate("/dashboard", {
          state: scanResult, // 🔥 single source of truth
        });
      }, 600);
    } catch (err) {
      console.error(err);
      setScanning(false);
      setBackendError(true);
    }
  };

  if (backendError) {
    return <BackendError onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold mb-4">
            Security Scanner
          </h1>
          <p className="text-muted-foreground">
            Scan Web2 & Web3 applications for security risks.
          </p>
        </motion.div>

        {/* Scan Form */}
        {!scanning ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-xl p-8 shadow-lg"
          >
            <form onSubmit={handleScan} className="space-y-6">

              <div>
                <label className="text-sm text-muted-foreground">
                  Target URL
                </label>
                <div className="relative mt-2">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-background border rounded-lg py-3 pl-12 pr-4 font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="p-4 bg-muted border rounded-lg flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Passive scan only. No exploitation or intrusive testing is performed.
                </p>
              </div>

              <button
                type="submit"
                disabled={!url.trim()}
                className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                Run Security Scan
                <ArrowRight />
              </button>
            </form>
          </motion.div>
        ) : (
          <>
            {/* Scan Progress */}
            <ScanTerminal progress={progress} status={status} />

            <div className="mt-8 text-center">
              <div className="inline-flex gap-2 px-4 py-2 rounded-full bg-muted border text-sm">
                <Loader2 className="animate-spin text-primary" />
                Analyzing <span className="font-mono">{url}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
