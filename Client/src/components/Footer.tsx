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
            <span>© 2025 Sentrix. All rights reserved.</span>
          </div>
          
         
          </div>
        </div>
      
    </footer>
  );
}
