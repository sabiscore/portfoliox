import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ProductionPatterns } from '@/components/ProductionPatterns';
import { GradientMeshMotion } from '@/components/GradientMeshMotion';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { generatePersonSchema } from '@/app/lib/structured-data';

export default function HomePage(): React.JSX.Element {
  return (
    <div className="relative min-h-screen bg-[#08090C] text-white selection:bg-[#00D9FF] selection:text-[#08090C]">
      <GradientMeshMotion />
      <Navbar />
      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generatePersonSchema()).replace(/</g, '\\u003c'),
          }}
        />
        <HeroSection />
        <ProjectsSection />
        <ProductionPatterns />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
