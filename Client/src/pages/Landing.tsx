import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { InfoSection } from '../components/InfoSection';
import { Footer } from '../components/Footer';

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Header />
      <main>
        <Hero />
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
}
