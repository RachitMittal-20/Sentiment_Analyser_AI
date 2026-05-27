const widthSafelist = Array.from({ length: 101 }, (_, index) => `w-[${index}%]`);
const delaySafelist = Array.from(
  { length: 10 },
  (_, index) => `[animation-delay:${index * 100}ms]`,
);

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  safelist: [...widthSafelist, ...delaySafelist],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#111118",
        border: "#1e1e2e",
        accent: "#6366f1",
        positive: "#22c55e",
        negative: "#ef4444",
        "text-primary": "#e2e8f0",
        "text-muted": "#64748b",
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "card-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "200% 0",
          },
          "100%": {
            backgroundPosition: "-200% 0",
          },
        },
      },
      animation: {
        "card-in": "card-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.6s linear infinite",
      },
      boxShadow: {
        panel: "0 24px 80px rgba(10, 10, 15, 0.55)",
      },
    },
  },
  plugins: [],
};
