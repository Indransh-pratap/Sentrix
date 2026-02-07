import { ShieldCheck } from "lucide-react";
import { useEffect } from "react";

interface ScanTerminalProps {
  progress: number;          // 0–100 (backend driven)
  status: string;            // backend status text
  onComplete?: () => void;   // optional callback
}

export function ScanTerminal({
  progress,
  status,
  onComplete,
}: ScanTerminalProps) {

  useEffect(() => {
    if (progress >= 100 && onComplete) {
      const t = setTimeout(onComplete, 600);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl border border-border bg-card p-6 shadow-lg">

      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="text-primary" size={26} />
        <h3 className="text-lg font-semibold text-foreground">
          Security Scan in Progress
        </h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        {status}
      </p>

      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 text-right text-xs text-muted-foreground">
        {progress}%
      </div>
    </div>
  );
}
