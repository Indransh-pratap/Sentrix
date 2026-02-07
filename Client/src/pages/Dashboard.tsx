import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Shield, Activity, Sparkles } from "lucide-react";
import { AiExplanationPanel } from "../components/AiExplanationPanel";

export function Dashboard() {
  const location = useLocation();
  const scanResult = location.state as any;
  const [showAI, setShowAI] = useState(false);

  if (!scanResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">
          No scan data found.
        </p>
        <Link
          to="/scan"
          className="px-6 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Run New Scan
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Top Bar */}
      <nav className="border-b h-16 flex items-center px-6">
        <Link to="/" className="flex gap-2 items-center">
          <Shield className="text-primary" />
          <span className="font-bold">Web3Guard</span>
        </Link>

        <span className="ml-auto font-mono text-sm text-muted-foreground">
          {scanResult.target}
        </span>
      </nav>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">

        {/* LEFT PANEL */}
        <div className="space-y-6">

          {/* Score */}
          {scanResult.score !== undefined && (
            <div className="bg-card p-6 rounded-xl border">
              <h3 className="text-muted-foreground mb-2">
                Security Score
              </h3>
              <div
                className={`text-5xl font-bold font-mono ${
                  scanResult.score >= 80
                    ? "text-green-500"
                    : scanResult.score >= 50
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {scanResult.score}
              </div>
            </div>
          )}

          {/* AI Explanation (optional) */}
          {scanResult.aiExplanation && (
            <>
              <button
                onClick={() => setShowAI(true)}
                className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex justify-center gap-2"
              >
                <Sparkles />
                Explain Risk with AI
              </button>

              {showAI && (
                <AiExplanationPanel explanation={scanResult.aiExplanation} />
              )}
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-2">
          <h2 className="text-xl mb-4 flex gap-2 items-center">
            <Activity className="text-primary" />
            Security Findings
          </h2>

          {scanResult.findings?.length === 0 ? (
            <div className="p-6 bg-card border rounded-xl text-muted-foreground">
              No client-side vulnerabilities detected 🎉
            </div>
          ) : (
            scanResult.findings.map((v: any, i: number) => (
              <div
                key={i}
                className="mb-4 p-5 bg-card border rounded-xl"
              >
                <h3 className="font-semibold">
                  {v.title}
                </h3>

                <p className="text-sm text-muted-foreground mt-1">
                  {v.detail || v.summary}
                </p>

                <p className="text-sm mt-2 text-red-500">
                  Impact: {v.walletImpact || v.confidenceImpact}
                </p>

                <p className="text-sm mt-2 text-green-500">
                  Severity: {v.severity}
                </p>

                {v.fix && (
                  <p className="text-sm mt-2 text-blue-500">
                    Fix: {v.fix}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
