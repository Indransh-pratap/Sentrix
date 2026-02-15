import { ShieldCheck, Globe, Lock, AlertTriangle, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export function About() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-white">About Sentrix</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            The first unified security scanner designed to protect both the user identity layer (Web2) and the asset layer (Web3) of modern applications.
          </p>
        </motion.div>

        {/* The Problem */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">The Forgotten Layer</h2>
          </div>
          <p className="text-gray-400 leading-relaxed text-lg">
            Security audits typically focus on two extremes: the backend API (Web2) or the smart contract (Web3). 
            However, the <strong>frontend interface</strong>—where the user actually clicks and signs—is often left vulnerable. 
            <br /><br />
            Attackers know this. Instead of breaking 256-bit encryption, they simply inject a script that swaps a wallet address or steals a session cookie right in the browser.
          </p>
        </div>

        {/* Web2 vs Web3 Risks */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-white/5 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Web2 Risks: Identity</h3>
            <p className="text-sm text-gray-500 mb-4">
              In traditional apps, the browser holds the keys to the user's identity.
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-2 items-start">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Session Hijacking:</strong> Stealing cookies to bypass 2FA.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Account Takeover:</strong> Keylogging passwords via XSS.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Data Exfiltration:</strong> Leaking PII to rogue servers.</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-white/5 rounded-2xl p-8">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6">
              <Lock className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Web3 Risks: Assets</h3>
            <p className="text-sm text-gray-500 mb-4">
              In dApps, the browser holds the keys to the user's financial assets.
            </p>
            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-2 items-start">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Wallet Spoofing:</strong> Fake connection popups.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Transaction Manipulation:</strong> Swapping "To" addresses.</span>
              </li>
              <li className="flex gap-2 items-start">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Asset Draining:</strong> Malicious "Approve" requests.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Why Unified? */}
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="shrink-0 w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
              <Layers className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Why a Unified Tool?</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Modern applications are hybrids. A DeFi dashboard (Web3) often uses Web2 authentication for analytics. 
                A SaaS platform (Web2) might add crypto payments (Web3).
              </p>
              <p className="text-gray-400 leading-relaxed">
                <strong>Sentrix</strong> bridges this gap. We don't just check for XSS; we check if that XSS can drain a wallet. 
                We don't just check for CSP; we check if it blocks malicious wallet connectors. 
                It is a holistic approach to client-side defense.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-medium border border-green-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Built for the Hackathon 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
}
