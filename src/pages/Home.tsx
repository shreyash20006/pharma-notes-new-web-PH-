import Hero from '../components/Hero';
import Features from '../components/Features';
import PricingPreview from '../components/PricingPreview';
import FAQ from '../components/FAQ';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <Features />
      <PricingPreview />
      <FAQ />
      <CTA />
    </div>
  );
}
