import { motion } from 'framer-motion';
import { ArrowRight, Zap, ShieldCheck, Globe, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 text-xs font-mono mb-6">
            <Zap className="w-3 h-3" />
            <span>SYSTEM_ONLINE // READY_TO_SCAN</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
            Secure Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Web2 & Web3</span> Frontend
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-10 leading-relaxed font-light">
            Detect client-side security risks affecting users, sessions, and crypto wallets.
            <span className="block mt-2 text-sm text-gray-500 font-mono">
              [XSS_DETECTION] [CSP_ANALYSIS] [WALLET_SAFETY]
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/scan"
              className="bg-green-600 hover:bg-green-500 text-black px-8 py-4 rounded-md font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/how-it-works"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-md font-bold transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
            >
              How It Works
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 text-sm">
             <div className="flex items-start gap-3 p-3 rounded border border-white/5 bg-white/5">
                <Globe className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <strong className="text-white block mb-1">Web2 Security</strong>
                  <span className="text-gray-500 text-xs">Protects User Data & Sessions</span>
                </div>
             </div>
             <div className="flex items-start gap-3 p-3 rounded border border-white/5 bg-white/5">
                <Wallet className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <strong className="text-white block mb-1">Web3 Security</strong>
                  <span className="text-gray-500 text-xs">Protects Wallets & Assets</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Right Side: Static Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative hidden lg:block"
        >
          <div className="w-full max-w-2xl mx-auto bg-black/90 border border-white/10 rounded-lg overflow-hidden shadow-2xl relative aspect-[4/3] flex items-center justify-center group cursor-default">
            {/* Static "Idle" State */}
            <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20 group-hover:border-green-500/50 transition-colors">
                  <ShieldCheck className="w-10 h-10 text-green-500" />
               </div>
               <div>
                 <h3 className="text-white font-mono text-lg">System Ready</h3>
                 <p className="text-gray-500 text-sm">Waiting for target URL...</p>
               </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
              <div className="w-3 h-3 rounded-full bg-green-500/20" />
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] text-gray-700 font-mono">
              v2.0.4-stable
            </div>
            
            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
