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
    <div className="bg-obsidian-base selection:bg-accent-cyan selection:text-obsidian-base relative min-h-screen text-white">
      <GradientMeshMotion />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
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
