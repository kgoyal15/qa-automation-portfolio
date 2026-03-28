export const TIMEOUTS = {
  /** Fast UI assertions — element already in DOM */
  SHORT: 5_000,
  /** Standard navigation / animation */
  MEDIUM: 15_000,
  /** Heavy pages, slow APIs, file uploads */
  LONG: 30_000,
  /** Background jobs, email delivery */
  EXTRA_LONG: 60_000,
} as const;

export const ANIMATION_DURATION = 300; // ms — used after CSS transitions
