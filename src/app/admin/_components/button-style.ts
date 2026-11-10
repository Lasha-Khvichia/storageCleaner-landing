/** Shared Ember classes for admin buttons. */
const BASE =
  "min-w-24 rounded-control border px-3 py-1.5 text-center text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:opacity-50";

export const BUTTON = `${BASE} border-line bg-surface text-fg hover:bg-surface-raised`;
export const BUTTON_PRIMARY = `${BASE} border-accent-500 bg-accent-500 text-fg hover:bg-accent-600`;
export const BUTTON_DANGER = `${BASE} border-review text-review hover:bg-surface-raised`;
