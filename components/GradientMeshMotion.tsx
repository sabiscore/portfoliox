'use client';

import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';

function DesktopOrbs({
  reducedMotion,
  scrollProgress,
}: {
  reducedMotion: boolean;
  scrollProgress: MotionValue<number>;
}) {
  const indigoRaw = useTransform(scrollProgress, [0, 1], reducedMotion ? [0, 0] : [0, 96]);
  const greenRaw = useTransform(scrollProgress, [0, 1], reducedMotion ? [0, 0] : [0, -72]);
  const amberRaw = useTransform(scrollProgress, [0, 1], reducedMotion ? [0, 0] : [0, -44]);

  const indigoY = useSpring(indigoRaw, { stiffness: 130, damping: 24, mass: 0.7 });
  const greenY = useSpring(greenRaw, { stiffness: 130, damping: 24, mass: 0.7 });
  const amberY = useSpring(amberRaw, { stiffness: 130, damping: 24, mass: 0.7 });

  return (
    <>
      <m.div
        className="gradient-mesh-wrap gradient-mesh-wrap--indigo"
        style={{ y: indigoY, willChange: 'transform' }}
      >
        <div className="gradient-mesh-orb gradient-mesh-orb--indigo orb-cw h-full w-full" />
      </m.div>

      <m.div
        className="gradient-mesh-wrap gradient-mesh-wrap--green"
        style={{ y: greenY, willChange: 'transform' }}
      >
        <div className="gradient-mesh-orb gradient-mesh-orb--green orb-ccw h-full w-full" />
      </m.div>

      <m.div
        className="gradient-mesh-wrap gradient-mesh-wrap--amber"
        style={{ y: amberY, willChange: 'transform' }}
      >
        <div className="gradient-mesh-orb gradient-mesh-orb--amber orb-slow h-full w-full" />
      </m.div>
    </>
  );
}

export function GradientMeshMotion() {
  const reducedMotion = useReducedMotion();
  const { scrollProgressRef } = useScrollCinema();
  const scrollProgress = useMotionValue(0);

  useAnimationFrame(() => {
    if (reducedMotion) {
      if (scrollProgress.get() !== 0) scrollProgress.set(0);
      return;
    }

    const next = scrollProgressRef.current;
    if (Math.abs(next - scrollProgress.get()) > 0.0007) {
      scrollProgress.set(next);
    }
  });

  return <DesktopOrbs reducedMotion={Boolean(reducedMotion)} scrollProgress={scrollProgress} />;
}
