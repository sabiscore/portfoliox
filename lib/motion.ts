import type { Transition, Variants } from 'framer-motion';

export const SPRING_SMOOTH: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 0.9,
};

export const SPRING_SNAPPY: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 26,
  mass: 0.8,
};

export const SPRING_CRISP: Transition = {
  type: 'spring',
  stiffness: 340,
  damping: 28,
  mass: 0.75,
};

export const FADE_UP_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_SMOOTH,
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.18,
    },
  },
};

export const IDENTITY_CARD_VARIANTS: Variants = {
  rest: {
    opacity: 1,
    y: 0,
    transition: SPRING_CRISP,
  },
  active: {
    opacity: 1,
    y: 0,
    transition: SPRING_CRISP,
  },
};

export const SAFE_OPACITY_VARIANTS: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.22,
    },
  },
};

export function ensureTransition(transition?: Transition): Transition | undefined {
  if (!transition) return undefined;

  if (
    typeof transition === 'object' &&
    ('hidden' in transition || 'visible' in transition || 'exit' in transition)
  ) {
    console.warn(
      'motion: Invalid transition object received. Variants were passed into transition.'
    );

    return SPRING_SMOOTH;
  }

  return transition;
}
