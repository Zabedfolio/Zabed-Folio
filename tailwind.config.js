/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        deep: "#050505",
        base: "#0a0808",
        accent: "#ff4d00",
        muted: "#666666",
        dim: "#333333"
      },
      boxShadow: {
        "accent-glow": "0 0 40px rgba(255,77,0,0.22)",
        "card-soft": "0 20px 60px rgba(0,0,0,0.4)",
        "inner-top": "inset 0 1px 0 rgba(255,255,255,0.08)"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at 50% 120%, rgba(255,77,0,0.2), rgba(255,77,0,0.02) 40%, transparent 72%)"
      }
    }
  },
  plugins: []
};
