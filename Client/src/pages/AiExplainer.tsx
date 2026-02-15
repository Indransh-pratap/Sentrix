import { motion } from 'framer-motion';
import { Bot, Sparkles, AlertTriangle, CheckCircle, Brain, Shield, Lock, Gavel } from 'lucide-react';
import { useState } from 'react';

export function AiExplainer() {
  const [selectedDemo, setSelectedDemo] = useState<'xss' | 'csp' | 'wallet'>('xss');

  const demoContent = {
    xss: {
      title: "Cross-Site Scripting (XSS)",
      tech: "Reflected XSS in URL Parameters",
      web2: "Attackers can steal your session cookies and takeover your account without a password.",
      web3: "Scripts can modify the 'To' address in your wallet popup, tricking you into sending funds to a hacker.",
      fix: "Sanitize all user inputs using a library like DOMPurify before rendering."
    },
    csp: {
      title: "Weak Content Security Policy",
      tech: "Missing or 'unsafe-inline' CSP Header",
      web2: "Allows malicious analytics scripts to exfiltrate user PII and credit card data.",
      web3: "Permits injection of fake 'Connect Wallet' overlays that steal private keys.",
      fix: "Implement a strict CSP that only allows scripts from your own trusted domain."
    },
    wallet: {
      title: "Insecure Wallet Connection",
      tech: "Window.ethereum Object Exposure",
      web2: "N/A (Specific to Web3)",
      web3: "Malicious sites can fingerprint your wallet address and target you with specific phishing attacks.",
      fix: "Only request wallet access after an explicit user interaction (click)."
    }
  };

  const current = demoContent[selectedDemo];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Powered by Trae AI</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">AI Security Explanation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Translating complex code vulnerabilities into plain English for developers and judges.
          </p>
        </motion.div>

        {/* 1. Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-white/5 rounded-2xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
             <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-4">The Problem</h2>
             <p className="text-gray-400 leading-relaxed">
               Security scans usually output raw, technical jargon like <code className="text-xs bg-white/10 px-1 py-0.5 rounded">Reflected XSS in query param q</code> or <code className="text-xs bg-white/10 px-1 py-0.5 rounded">Missing script-src directive</code>. 
               <br /><br />
               For non-experts, this is confusing. It doesn't explain the <strong>real-world impact</strong> on users or assets.
             </p>
          </div>

          <div className="bg-card border border-white/5 rounded-2xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
             <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-6">
                <Bot className="w-6 h-6 text-green-500" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-4">The Solution</h2>
             <p className="text-gray-400 leading-relaxed">
               Trae AI analyzes these raw findings and generates a <strong>context-aware explanation</strong>. 
               <br /><br />
               It explicitly translates technical errors into two clear risk scenarios: 
               <strong> Web2 Data Loss</strong> and <strong> Web3 Wallet Theft</strong>, making the danger instantly understandable.
             </p>
          </div>
        </div>

        {/* 2. Use Case & Judge Benefit */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="bg-card border border-white/5 rounded-2xl p-8 flex items-start gap-4">
             <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-500" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white mb-2">Unified Use Case</h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                 Whether checking a traditional SaaS login (Web2) or a DeFi protocol (Web3), 
                 Trae AI adapts its explanation to the specific tech stack involved.
               </p>
             </div>
          </div>

          <div className="bg-card border border-white/5 rounded-2xl p-8 flex items-start gap-4">
             <div className="shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-purple-500" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-white mb-2">Benefit for Judges</h3>
               <p className="text-sm text-gray-400 leading-relaxed">
                 Hackathon judges don't need to be security experts. Trae AI's summaries allow them to 
                 grasp the severity of a vulnerability in seconds, without reading code.
               </p>
             </div>
          </div>
        </div>

        {/* 3. Interactive Demo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Live Example: See Trae AI in Action
          </h2>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Vulnerability</h3>
              <button 
                onClick={() => setSelectedDemo('xss')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedDemo === 'xss' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-white/5 hover:bg-white/5'}`}
              >
                <div className="font-bold">XSS Vulnerability</div>
                <div className="text-xs opacity-70 mt-1">Reflected Cross-Site Scripting</div>
              </button>
              <button 
                onClick={() => setSelectedDemo('csp')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedDemo === 'csp' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-white/5 hover:bg-white/5'}`}
              >
                <div className="font-bold">Weak CSP</div>
                <div className="text-xs opacity-70 mt-1">Content-Security-Policy Missing</div>
              </button>
              <button 
                onClick={() => setSelectedDemo('wallet')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedDemo === 'wallet' ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-white/5 hover:bg-white/5'}`}
              >
                <div className="font-bold">Wallet Exposure</div>
                <div className="text-xs opacity-70 mt-1">Unsafe Object Access</div>
              </button>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="bg-card border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{current.title}</h2>
                    <code className="text-sm text-gray-500 font-mono">{current.tech}</code>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-black/30 rounded-xl p-6 border border-white/5">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                      <Globe className="w-4 h-4 text-blue-400" />
                      Web2 Impact (Users)
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{current.web2}</p>
                  </div>

                  <div className="bg-black/30 rounded-xl p-6 border border-white/5">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
                      <Brain className="w-4 h-4 text-purple-400" />
                      Web3 Impact (Wallets)
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{current.web3}</p>
                  </div>

                  <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-green-400 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      Trae AI Recommendation
                    </h3>
                    <p className="text-green-100/80 leading-relaxed">{current.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-12 border-t border-white/5">
          <p className="text-sm text-muted-foreground">
            AI-assisted explanations powered by Trae AI
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function Globe({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}
