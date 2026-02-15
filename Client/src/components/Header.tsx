import { Shield, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useState } from 'react';

export function Header() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show header on dashboard since it has its own nav
  if (isDashboard) return null;

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/30 blur-lg rounded-full group-hover:bg-green-500/50 transition-all" />
            <Shield className="w-8 h-8 text-green-500 relative z-10" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          Sentrix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className={cn("hover:text-green-400 transition-colors", location.pathname === '/' ? "text-green-400" : "text-gray-400")}>
            Home
          </Link>
          <Link to="/how-it-works" className={cn("hover:text-green-400 transition-colors", location.pathname === '/how-it-works' ? "text-green-400" : "text-gray-400")}>
            How It Works
          </Link>
          <Link to="/ai-explainer" className={cn("hover:text-green-400 transition-colors", location.pathname === '/ai-explainer' ? "text-green-400" : "text-gray-400")}>
            AI Explainer
          </Link>
          <Link to="/chat" className={cn("hover:text-green-400 transition-colors", location.pathname === '/chat' ? "text-green-400" : "text-gray-400")}>
            AI Chatbot
          </Link>
          <Link to="/about" className={cn("hover:text-green-400 transition-colors", location.pathname === '/about' ? "text-green-400" : "text-gray-400")}>
            About
          </Link>
          <Link to="/team" className={cn("hover:text-green-400 transition-colors", location.pathname === '/team' ? "text-green-400" : "text-gray-400")}>
            Team
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
            GitHub
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/5 py-4 px-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-5 z-50">
          <Link 
            to="/" 
            className={cn("p-2 rounded-md transition-colors", location.pathname === '/' ? "bg-white/5 text-green-400" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link 
            to="/how-it-works" 
            className={cn("p-2 rounded-md transition-colors", location.pathname === '/how-it-works' ? "bg-white/5 text-green-400" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            onClick={closeMenu}
          >
            How It Works
          </Link>
          <Link 
            to="/ai-explainer" 
            className={cn("p-2 rounded-md transition-colors", location.pathname === '/ai-explainer' ? "bg-white/5 text-green-400" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            onClick={closeMenu}
          >
            AI Explainer
          </Link>
          <Link 
            to="/chat" 
            className={cn("p-2 rounded-md transition-colors", location.pathname === '/chat' ? "bg-white/5 text-green-400" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            onClick={closeMenu}
          >
            AI Chatbot
          </Link>
          <Link 
            to="/about" 
            className={cn("p-2 rounded-md transition-colors", location.pathname === '/about' ? "bg-white/5 text-green-400" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            onClick={closeMenu}
          >
            About
          </Link>
          <Link 
            to="/team" 
            className={cn("p-2 rounded-md transition-colors", location.pathname === '/team' ? "bg-white/5 text-green-400" : "text-gray-400 hover:bg-white/5 hover:text-white")}
            onClick={closeMenu}
          >
            Team
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2 text-gray-400 hover:bg-white/5 hover:text-white rounded-md transition-colors"
            onClick={closeMenu}
          >
            GitHub
          </a>
        </div>
      )}
    </header>
  );
}
