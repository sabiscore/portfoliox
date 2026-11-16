import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { IdentityCard } from "@/components/IdentityCard";
import { ProjectsSection } from "@/components/ProjectsSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-obsidian-base text-obsidian-text pb-20">
      {/* 00: Hero & Commit Telemetry */}
      <HeroSection />

      {/* 00.5: Operating Model & Identity Specification */}
      <IdentityCard portraitSrc="/headshot.webp" />

      {/* 01: Production Case Studies */}
      <ProjectsSection />
    </main>
  );
}
