import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { Demo } from './pages/Demo';
import { ScanPage } from './pages/ScanPage';
import { Team } from './pages/Team';
import { AiExplainer } from './pages/AiExplainer';
import { ChatPage } from './pages/ChatPage';
import { HowItWorks } from './components/HowItWorks';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/ai-explainer" element={<AiExplainer />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            {/* Catch-all route to prevent 404s on refresh if backend serving is misconfigured */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
