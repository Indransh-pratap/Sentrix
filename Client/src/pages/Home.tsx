import { Hero } from '../components/Hero';
import { ProductDemo } from '../components/ProductDemo';
import { InfoSection } from '../components/InfoSection';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <ProductDemo />
      <InfoSection />
    </div>
  );
}