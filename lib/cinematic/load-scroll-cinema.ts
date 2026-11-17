export interface ScrollTriggerInstance {
  kill: () => void;
  progress?: number;
  direction?: number;
  isActive?: boolean;
}

export interface ScrollTriggerStatic {
  update: () => void;
  refresh: (safe?: boolean) => void;
  getAll: () => ScrollTriggerInstance[];
  create: (vars: Record<string, unknown>) => ScrollTriggerInstance;
}

export interface GsapRuntime {
  registerPlugin: (...plugins: unknown[]) => void;
  ticker: {
    add: (callback: (time: number) => void, once?: boolean, prioritize?: boolean) => void;
    remove: (callback: (time: number) => void) => void;
    lagSmoothing: (threshold: number, adjustedLag?: number) => void;
  };
  to: (targets: unknown, vars: Record<string, unknown>) => unknown;
  fromTo: (
    targets: unknown,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>
  ) => unknown;
  timeline: (vars?: Record<string, unknown>) => unknown;
  context: (func: () => void, scope?: unknown) => { revert: () => void };
}

export interface ScrollCinemaRuntime {
  gsap: GsapRuntime;
  ScrollTrigger: ScrollTriggerStatic;
}

let runtimePromise: Promise<ScrollCinemaRuntime> | null = null;

export function loadScrollCinemaRuntime(): Promise<ScrollCinemaRuntime> {
  runtimePromise ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([gsapModule, scrollTriggerModule]) => {
      const gsap = (gsapModule.gsap ?? gsapModule.default ?? gsapModule) as unknown as GsapRuntime;
      const ScrollTrigger = (scrollTriggerModule.ScrollTrigger ??
        scrollTriggerModule.default ??
        scrollTriggerModule) as unknown as ScrollTriggerStatic;

      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    }
  );

  return runtimePromise;
}
