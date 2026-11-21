'use client';

import * as THREE from 'three';
import { useEffect, useRef } from 'react';

type PerformanceHints = Navigator & {
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
  };
  deviceMemory?: number;
  hardwareConcurrency?: number;
};

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;
uniform float uIntensity;
uniform vec3 uAccent;
uniform vec3 uWash;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 m = mat2(1.62, 1.18, -1.18, 1.62);

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = m * p;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 centered = uv - 0.5;
  centered.x *= uResolution.x / max(uResolution.y, 1.0);

  float t = uTime * 0.06;

  vec2 drift = vec2(
    fbm(uv * 2.1 + vec2(t * 0.14, -t * 0.06)),
    fbm(uv * 2.8 - vec2(t * 0.09, t * 0.12))
  );

  float field = fbm(uv * 3.8 + drift * 0.9 + vec2(0.0, t * 0.25));
  float halo = smoothstep(0.58, 0.08, length(uv - uPointer));
  float rim = smoothstep(0.24, 0.72, length(centered));
  float pulse = 0.72 + 0.28 * sin(t * 1.1 + drift.x * 1.8);

  vec3 base = mix(uWash, vec3(0.02, 0.05, 0.08), field * 0.7);
  vec3 tint = uAccent * (0.08 + halo * 0.14 + field * 0.12);

  float alpha = clamp((0.06 + field * 0.2 + halo * 0.1) * rim * pulse, 0.0, 0.42) * uIntensity;
  gl_FragColor = vec4(base + tint, alpha);
}
`;

function getShaderTier(): 'low' | 'medium' | 'high' {
  if (typeof window === 'undefined') {
    return 'low';
  }

  const hints = navigator as PerformanceHints;
  const connection = hints.connection;
  const slowConnection = /(^|-)2g$|slow-2g/i.test(connection?.effectiveType ?? '');
  const saveData = Boolean(connection?.saveData);
  const lowMemory = typeof hints.deviceMemory === 'number' && hints.deviceMemory <= 4;
  const lowCores = typeof hints.hardwareConcurrency === 'number' && hints.hardwareConcurrency <= 4;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (saveData || slowConnection || lowMemory || lowCores || coarsePointer || reducedMotion) {
    return 'low';
  }

  if (
    (hints.deviceMemory ?? 8) >= 8 &&
    (hints.hardwareConcurrency ?? 8) >= 8 &&
    connection?.effectiveType?.includes('4g')
  ) {
    return 'high';
  }

  return 'medium';
}

export function HeroPortraitShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const tier = getShaderTier();
    if (tier === 'low') return;

    let animationFrame = 0;
    let disposed = false;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    });

    renderer.autoClear = true;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier === 'high' ? 1.25 : 1));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.34) },
      uTime: { value: 0 },
      uIntensity: { value: tier === 'high' ? 0.65 : 0.48 },
      uAccent: { value: new THREE.Color('#00D9FF') },
      uWash: { value: new THREE.Color('#08090C') },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      if (disposed) return;
      const rect = parent.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width, height);
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      uniforms.uPointer.value.set(
        Math.min(1, Math.max(0, x)),
        Math.min(1, Math.max(0, y))
      );
    };

    const resetPointer = () => {
      uniforms.uPointer.value.set(0.5, 0.34);
    };

    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            resize();
          })
        : null;

    observer?.observe(parent);
    resize();

    parent.addEventListener('pointermove', updatePointer);
    parent.addEventListener('pointerleave', resetPointer);
    parent.addEventListener('pointercancel', resetPointer);

    const render = (time: number) => {
      if (disposed) return;
      uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      parent.removeEventListener('pointermove', updatePointer);
      parent.removeEventListener('pointerleave', resetPointer);
      parent.removeEventListener('pointercancel', resetPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="portrait-shader-canvas"
    />
  );
}
