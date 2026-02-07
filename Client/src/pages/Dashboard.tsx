import { Link, useLocation } from "react-router-dom";
import { Shield, Activity } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background pb-20">

      <nav className="border-b h-16 flex items-center px-6">
        <Link to="/" className="flex gap-2 items-center">
          <Shield className="text-primary" />
          <span className="font-bold">Web3Guard</span>
        </Link>
        <span className="ml-auto font-mono text-sm text-muted-foreground">
          {scanResult.target}
        </span>
      </nav>

      <div className="container mx-auto px-4 py-8">

        <h2 className="text-xl mb-4 flex gap-2 items-center">
          <Activity className="text-primary" />
          Security Findings
        </h2>

        {scanResult.findings
          .filter((v: any) => v && v.title && v.severity)
          .map((v: any, i: number) => (
            <div
              key={i}
              className="mb-4 p-5 bg-card border rounded-xl"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{v.title}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                  v.severity === 'High' || v.severity === 'Critical' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                  v.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                  'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                }`}>
                  {v.severity}
                </span>
              </div>

              {v.detail && (
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  {v.detail}
                </p>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {v.impact && (
                  <div className="text-sm bg-red-500/5 p-3 rounded border border-red-500/10">
                    <span className="font-semibold text-red-400 block mb-1">Impact</span>
                    <span className="text-muted-foreground">{v.impact}</span>
                  </div>
                )}

                {v.fix && (
                  <div className="text-sm bg-green-500/5 p-3 rounded border border-green-500/10">
                    <span className="font-semibold text-green-400 block mb-1">Remediation</span>
                    <span className="text-muted-foreground">{v.fix}</span>
                  </div>
                )}
              </div>

              {v.url && (
                <div className="mt-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Proof of Concept</span>
                  <div className="mt-1 text-xs bg-black/20 border border-white/5 p-2 rounded break-all font-mono text-muted-foreground">
                    {v.url}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
