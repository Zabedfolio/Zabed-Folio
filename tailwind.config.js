/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bricolage: ["var(--font-bricolage)", "sans-serif"],
      },
      colors: {
        deep: "#050505",
        base: "#0a0808",
        accent: {
          DEFAULT: "#1FB57A",
          dark: "#12A36B",
          light: "#34D399"
        },
        muted: "#666666",
        dim: "#333333"
      },
      boxShadow: {
        "accent-glow": "0 0 40px rgba(31,181,122,0.25)",
        "card-soft": "0 20px 60px rgba(0,0,0,0.4)",
        "inner-top": "inset 0 1px 0 rgba(255,255,255,0.08)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 50% 120%, rgba(31,181,122,0.22), rgba(18,163,107,0.02) 40%, transparent 72%)",
        "accent-gradient": "linear-gradient(135deg, #1FB57A 0%, #12A36B 100%)"
      }
    }
  },
  plugins: []
};
