import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { IdentityCard } from '@/components/IdentityCard';
import { ProjectsSection } from '@/components/ProjectsSection';
import { ProductionPatterns } from '@/components/ProductionPatterns';
import { GradientMeshMotion } from '@/components/GradientMeshMotion';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

export default function HomePage(): React.JSX.Element {
  return (
    <div className="relative min-h-screen bg-[#08090C] text-white selection:bg-[#00D9FF] selection:text-[#08090C]">
      <GradientMeshMotion />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <div id="identity">
          <IdentityCard />
        </div>
        <ProjectsSection />
        <ProductionPatterns />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
