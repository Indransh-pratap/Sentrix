import { Link, useLocation } from "react-router-dom";
import { Shield, Activity, Download } from "lucide-react";
import { downloadReport } from "../lib/api";

export function Dashboard() {
  const location = useLocation();
  const scanResult = location.state as any;

  if (!scanResult) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/scan" className="px-6 py-3 bg-primary text-white rounded">
          Run New Scan
        </Link>
      </div>
    );
  }

  // 🔥 Normalize all findings (client-side + backend SQLi)
  // scanResult.findings contains all findings from the backend (including SQLi)
  // We keep the merge logic just in case older backend logic is used, but deduplicate based on title/detail
  const rawFindings = [
    ...(scanResult.findings || []),
    ...(scanResult.vulnerabilities?.sqli || []),
  ];

  // Simple deduplication
  const findings = Array.from(new Set(rawFindings.map((f: any) => JSON.stringify(f))))
    .map((s: any) => JSON.parse(s));

  // Re-construct the full object for PDF generation
  const fullResult = {
    ...scanResult,
    findings: findings
  };

  // Risk Data (from backend)
  const risk = scanResult?.riskAnalysis || {};
  const riskPercent = risk.riskPercent ?? 0;
  const level = risk.level ?? "Unknown";

  const getRiskColor = (p: number) => {
    if (p >= 70) return "text-red-500";
    if (p >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressColor = (p: number) => {
    if (p >= 70) return "bg-red-500";
    if (p >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Navbar */}
      <nav className="border-b h-16 flex items-center px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <Link to="/" className="flex gap-2 items-center hover:opacity-80 transition-opacity">
          <Shield className="text-primary fill-primary/10" />
          <span className="font-bold text-xl tracking-tight">Sentrix</span>
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground hidden md:block px-3 py-1 bg-muted rounded-full border border-border/50">
            {scanResult.target}
          </span>

          <button
            onClick={() => downloadReport(fullResult)}
            className="text-sm font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2 border border-border"
          >
            <Download className="w-4 h-4" />
            PDF Report
          </button>

          <Link
            to="/scan"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            New Scan
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Security Report</h2>
            <p className="text-muted-foreground">
              Analysis completed for{" "}
              <span className="text-foreground font-medium">
                {scanResult.target}
              </span>
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-primary">
              {findings.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Issues Found
            </div>
            {risk.level && (
              <div className="text-xs text-muted-foreground mt-1 flex items-center justify-end gap-2">
                Risk Score: 
                <span className={`font-bold ${getRiskColor(riskPercent)}`}>
                  {riskPercent}% ({level})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Findings */}
        <div className="space-y-6">
          {findings
            .filter((v: any) => v && v.title && v.severity)
            .map((v: any, i: number) => (
              <div
                key={i}
                className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="p-6">

                  {/* Title + Severity */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          v.severity === "High" || v.severity === "Critical"
                            ? "bg-red-500/10 text-red-500"
                            : v.severity === "Medium"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        <Shield className="w-6 h-6" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-xl mb-1 group-hover:text-primary transition-colors">
                          {v.title}
                        </h3>

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            v.severity === "High" || v.severity === "Critical"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : v.severity === "Medium"
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          }`}
                        >
                          {v.severity} Severity
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {v.detail && (
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {v.detail}
                    </p>
                  )}

                  {/* Impact & Fix */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {v.impact && (
                      <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/10">
                        <h4 className="font-semibold text-red-500 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Impact
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {v.impact}
                        </p>
                      </div>
                    )}

                    {v.fix && (
                      <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/10">
                        <h4 className="font-semibold text-green-500 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Shield className="w-4 h-4" /> Remediation
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {v.fix}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Proof */}
                  {v.url && (
                    <div className="mt-6 pt-6 border-t border-border/50">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                        Proof of Concept
                      </span>
                      <div className="bg-muted/50 border border-border rounded-lg p-3 font-mono text-xs text-muted-foreground break-all select-all">
                        {v.url}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* No issues */}
        {findings.length === 0 && (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
            <Shield className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">
              No Vulnerabilities Detected
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Great job! No vulnerabilities were detected in this scan.
            </p>
            <Link to="/scan" className="text-primary hover:underline">
              Scan another URL
            </Link>
          </div>
        )}

        {/* ================= RISK FOOTER UI ================= */}
        {scanResult.riskAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm relative overflow-hidden"
          >
            {/* Background Glow based on Risk */}
            <div 
              className={`absolute inset-0 opacity-5 pointer-events-none ${getProgressColor(riskPercent)}`} 
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full bg-background border border-border shadow-sm`}>
                  <Shield className={`w-8 h-8 ${getRiskColor(riskPercent)}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Security Posture</h3>
                  <p className="text-sm text-muted-foreground">
                    Current threat level analysis
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full md:max-w-md">
                <div className="flex justify-between text-xs font-medium mb-2 uppercase tracking-wider text-muted-foreground">
                  <span>Safe</span>
                  <span>Critical</span>
                </div>
                <div className="h-4 bg-muted/50 rounded-full overflow-hidden border border-border/50 relative">
                  {/* Gradient Bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 opacity-20" />
                  
                  {/* Indicator Pill */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${riskPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${getProgressColor(riskPercent)} relative shadow-[0_0_10px_rgba(0,0,0,0.2)]`}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50" />
                  </motion.div>
                </div>
              </div>

              <div className="text-center md:text-right min-w-[120px]">
                <div className={`text-3xl font-bold ${getRiskColor(riskPercent)}`}>
                  {riskPercent}/100
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-1 border border-border px-2 py-1 rounded bg-background/50">
                  {level} ZONE
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
