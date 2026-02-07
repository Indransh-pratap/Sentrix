import { motion } from 'framer-motion';
import { ShieldAlert, Globe, Code2, Lock } from 'lucide-react';

const risks = [
  {
    icon: ShieldAlert,
    title: "XSS Vulnerabilities",
    description: "Cross-Site Scripting attacks can inject malicious scripts to drain wallets or sign unauthorized transactions.",
    color: "text-red-400"
  },
  {
    icon: Lock,
    title: "Weak CSP Headers",
    description: "Missing Content Security Policies allow attackers to load external scripts or exfiltrate private keys.",
    color: "text-orange-400"
  },
  {
    icon: Globe,
    title: "Malicious Dependencies",
    description: "Compromised npm packages in your supply chain can silently hijack user interactions.",
    color: "text-yellow-400"
  },
  {
    icon: Code2,
    title: "Insecure RPC Calls",
    description: "Exposed API keys or unverified RPC endpoints can lead to man-in-the-middle attacks.",
    color: "text-blue-400"
  }
];

export function InfoSection() {
  return (
    <section id="features" className="py-24 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Frontend Security Matters</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Web3 dApps are unique targets. Traditional scanners miss the specific vectors that put crypto assets at risk.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {risks.map((risk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/20 hover:bg-white/5 transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 ${risk.color} group-hover:scale-110 transition-transform`}>
                <risk.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{risk.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {risk.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
