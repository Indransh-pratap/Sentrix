import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ScanTerminal } from '../components/ScanTerminal';
import { useNavigate } from 'react-router-dom';

export function Demo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const navigate = useNavigate();

  const startDemo = () => {
    setIsPlaying(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const steps = [
      { p: 10, s: "Connecting to target: vulnerable-defi.com" },
      { p: 30, s: "Analyzing frontend assets..." },
      { p: 50, s: "Checking for XSS vulnerabilities..." },
      { p: 70, s: "Scanning for wallet drainers..." },
      { p: 85, s: "Verifying CSP headers..." },
      { p: 100, s: "Scan completed. Generating report..." },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep >= steps.length) {
        clearInterval(interval);
        return;
      }

      const { p, s } = steps[currentStep];
      setProgress(p);
      setStatus(s);
      currentStep++;
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDemoComplete = () => {
    const mockResult = {
      target: "https://vulnerable-defi.com",
      time: new Date().toISOString(),
      findings: [
        {
          title: "Reflected XSS in Search Bar",
          severity: "High",
          detail: "Reflected Cross-Site Scripting vulnerability found in parameter 'q'.",
          impact: "Attacker can execute malicious scripts in the user's browser, potentially stealing cookies or session tokens.",
          fix: "Sanitize and encode all user-controlled input.",
          url: "https://vulnerable-defi.com/search?q=<script>alert(1)</script>"
        },
        {
          title: "Missing Content-Security-Policy",
          severity: "Medium",
          detail: "The website does not have a Content-Security-Policy (CSP) header.",
          impact: "Increases risk of XSS and data injection attacks.",
          fix: "Add a strict Content-Security-Policy header to response."
        },
        {
          title: "Wallet Drainer Script Detected",
          severity: "Critical",
          detail: "Suspicious script 'drain.js' found attempting to access window.ethereum.",
          impact: "Direct risk of user funds being stolen via malicious transaction signing.",
          fix: "Remove the malicious script immediately and audit all third-party dependencies.",
          url: "https://vulnerable-defi.com/assets/js/drain.js"
        }
      ]
    };

    setTimeout(() => {
      navigate('/dashboard', { state: mockResult });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {!isPlaying ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
              <Play className="w-8 h-8 text-primary ml-1" />
            </div>
            <h1 className="text-4xl font-bold text-white">Interactive Scan Demo</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the full security analysis workflow in real-time. 
              This demo simulates a scan against a vulnerable DeFi protocol.
            </p>
            
            <button 
              onClick={startDemo}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-full text-lg transition-all shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary),0.5)]"
            >
              Start Live Demo
            </button>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-xl bg-card border border-white/5">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-500 font-bold">1</div>
                <h3 className="font-bold text-white mb-2">Initialize</h3>
                <p className="text-sm text-gray-500">Scanner connects to the target frontend and maps assets.</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-white/5">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 text-purple-500 font-bold">2</div>
                <h3 className="font-bold text-white mb-2">Analyze</h3>
                <p className="text-sm text-gray-500">Checks for XSS, CSP, and wallet interaction risks.</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-white/5">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-500 font-bold">3</div>
                <h3 className="font-bold text-white mb-2">Report</h3>
                <p className="text-sm text-gray-500">Generates AI-powered risk assessment and fix suggestions.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="w-full max-w-3xl mx-auto">
            <ScanTerminal
              progress={progress}
              status={status}
              onComplete={handleDemoComplete}
            />

            <p className="mt-8 text-muted-foreground animate-pulse">
              Running heuristic analysis...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
