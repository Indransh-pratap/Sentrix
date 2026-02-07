import { Link, useLocation } from "react-router-dom";
import { Shield, Activity, Database } from "lucide-react";

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

      <nav className="border-b h-16 flex items-center px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <Link to="/" className="flex gap-2 items-center hover:opacity-80 transition-opacity">
          <Shield className="text-primary fill-primary/10" />
          <span className="font-bold text-xl tracking-tight">Sentrix</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground hidden md:block px-3 py-1 bg-muted rounded-full border border-border/50">
            {scanResult.target}
          </span>
          <Link 
            to="/scan" 
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            New Scan
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold flex gap-3 items-center mb-2">
              Security Report
            </h2>
            <p className="text-muted-foreground">
              Analysis completed for <span className="text-foreground font-medium">{scanResult.target}</span>
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-primary">{scanResult.findings.length}</div>
            <div className="text-sm text-muted-foreground">Issues Found</div>
          </div>
        </div>

        <div className="space-y-6">
        {scanResult.findings
          .filter((v: any) => v && v.title && v.severity)
          .map((v: any, i: number) => (
            <div
              key={i}
              className="group bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      v.severity === 'High' || v.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                      v.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-1 group-hover:text-primary transition-colors">{v.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        v.severity === 'High' || v.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        v.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {v.severity} Severity
                      </span>
                    </div>
                  </div>
                </div>

                {v.detail && (
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {v.detail}
                  </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {v.impact && (
                    <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/10">
                      <h4 className="font-semibold text-red-500 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Impact
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.impact}</p>
                    </div>
                  )}

                  {v.fix && (
                    <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/10">
                      <h4 className="font-semibold text-green-500 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Remediation
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.fix}</p>
                    </div>
                  )}
                </div>

                {v.url && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Proof of Concept</span>
                    <div className="bg-muted/50 border border-border rounded-lg p-3 font-mono text-xs text-muted-foreground break-all select-all hover:bg-muted transition-colors">
                      {v.url}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {scanResult.findings.length === 0 && (
          <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
            <Shield className="w-16 h-16 text-green-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">No Vulnerabilities Detected</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Great job! No common client-side vulnerabilities were found in this scan.
            </p>
            <Link to="/scan" className="text-primary hover:underline">
              Scan another URL
            </Link>
          </div>
        )}

        {/* Coming Soon: SQL Injection */}
        <div className="mt-8 p-6 rounded-xl border border-dashed border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                SQL Injection (SQLi) Detection
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                  Coming Soon
                </span>
              </h3>
              <p className="text-sm text-muted-foreground">
                Advanced database vulnerability scanning module
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            Our team is working on a powerful SQL injection detection engine that will automatically test for database vulnerabilities, helping you secure your backend data layer against unauthorized access and data leaks.
          </p>
        </div>

      </div>
    </div>
  );
}
