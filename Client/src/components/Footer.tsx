import { Bot } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  // Don't show global footer on dashboard since it has its own layout
  if (isDashboard) return null;

  return (
    <footer className="py-12 border-t border-white/5 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>© 2025 Web3Guard. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <div className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-primary" />
              <span className="font-semibold text-white">Trae AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
