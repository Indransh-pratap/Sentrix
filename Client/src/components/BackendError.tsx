import { AlertTriangle } from "lucide-react";

interface BackendErrorProps {
  onRetry: () => void;
}

export function BackendError({ onRetry }: BackendErrorProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
      <AlertTriangle size={48} className="text-destructive mb-4" />

      <h1 className="text-2xl font-semibold mb-2">
        Backend Unreachable
      </h1>

      <p className="text-center text-muted-foreground max-w-md">
        Our security engine is currently unavailable.
        Please try again after some time.
      </p>

      <button
        onClick={onRetry}
        className="mt-6 px-6 py-2 rounded-md bg-primary text-primary-foreground"
      >
        Retry Scan
      </button>
    </div>
  );
}
