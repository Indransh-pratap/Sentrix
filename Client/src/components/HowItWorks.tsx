import { motion } from 'framer-motion';
import { ArrowDown, Globe, ShieldCheck, Search, FileText, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  {
    icon: Globe,
    title: "1. URL Submitted",
    description: "You provide a target Website or dApp URL."
  },
  {
    icon: Search,
    title: "2. Frontend Analyzed",
    description: "Our scanner fetches client-side assets and headers."
  },
  {
    icon: ShieldCheck,
    title: "3. Security Rules Checked",
    description: "We test against OWASP Top 10 and Web3-specific vectors."
  },
  {
    icon: FileText,
    title: "4. Risk Evaluated",
    description: "Findings are categorized by severity and impact."
  },
  {
    icon: BrainCircuit,
    title: "5. Explained by AI",
    description: "Trae AI translates findings into plain English recommendations."
  }
];

export function HowItWorks() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-white">How It Works</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-xl">
            A transparent, step-by-step analysis process designed for clarity.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block" />

          <div className="space-y-12 relative">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center gap-8 md:gap-16",
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                )}
              >
                {/* Text Side */}
                <div className={cn(
                  "flex-1 md:text-right",
                  index % 2 !== 0 && "md:text-left"
                )}>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Icon Center */}
                <div className="relative shrink-0 z-10">
                  <div className="w-12 h-12 rounded-full bg-background border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Empty Side for Balance */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
