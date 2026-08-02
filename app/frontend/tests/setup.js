import '@testing-library/jest-dom/vitest';

// jsdom has no ResizeObserver; Recharts' ResponsiveContainer needs one to
// measure and render its children.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
