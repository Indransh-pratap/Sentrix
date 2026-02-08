import { motion } from 'framer-motion';
import { ShieldCheck, Code, Brain, Terminal, Server, Database } from 'lucide-react';

export function Team() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6 text-white">Meet the Team</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The people building secure Web2 & Web3 frontends.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TeamCard 
            name="Indransh Pratap Singh"
            role="Developer" 
            icon={ShieldCheck} 
            color="text-green-500"
            bg="bg-green-500/10"

          />
          <TeamCard 
            name="Deepak Kharb"
            role="Application security" 
            icon={Code} 
            color="text-blue-500"
            bg="bg-blue-500/10"
         
          />
          <TeamCard 
            name="Radhika Gupta"
            role="LLM Integration & Prompt Engineering" 
            icon={Brain} 
            color="text-purple-500"
            bg="bg-purple-500/10"
           
          />
        </div>

        <div className="mt-20 border-t border-white/5 pt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Built with <span className="text-red-500">♥</span> for Hackathon 2025
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
            <Terminal className="w-3 h-3" />
            <span>git commit -m "initial release"</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamCard({ name, role, icon: Icon, color, bg}: { name: string, role: string, icon: any, color: string, bg: string}) {
  return (
    <div className="bg-card border border-white/5 p-8 rounded-xl text-left hover:border-white/10 transition-colors group">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider border ${color.replace('text-', 'border-').replace('500', '500/20')} ${color.replace('text-', 'text-opacity-80 text-')}`}>
          Core Team
        </div>
      </div>
      
      <h3 className="font-bold text-white text-lg mb-1 group-hover:text-primary transition-colors">{name}</h3>
      <p className="text-sm font-medium text-gray-400 mb-4">{role}</p>
      <p className="text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-4">

      </p>
    </div>
  );
}
