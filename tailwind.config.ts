import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        heading: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        // Nocturne Campus Glass Palette
        canvas: {
          midnight: "#0B0819",
          surface: "#141122",
          lowest: "#0F0C1D",
          low: "#1C192B",
          card: "#201D2F",
          high: "#2B283A",
          highest: "#363245",
        },
        brand: {
          violet: "#8B5CF6",
          "violet-light": "#D0BCFF",
          "violet-dark": "#3C0091",
          magenta: "#EC4899",
          "magenta-light": "#FFB0CD",
          blue: "#3B82F6",
          "blue-light": "#ADC6FF",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          hover: "rgba(255, 255, 255, 0.09)",
          active: "rgba(255, 255, 255, 0.15)",
          border: "rgba(255, 255, 255, 0.12)",
          "border-hover": "rgba(255, 255, 255, 0.25)",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#CBC3D7",
          muted: "#94A3B8",
          dim: "#64748B",
        },
      },
      borderRadius: {
        "2xl": "1rem", // 16px
        "3xl": "1.5rem", // 24px
        "4xl": "2rem", // 32px
        full: "9999px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-hover": "0 12px 32px -4px rgba(139, 92, 246, 0.25)",
        "glow-violet": "0 0 24px rgba(139, 92, 246, 0.4)",
        "glow-magenta": "0 0 24px rgba(236, 72, 153, 0.4)",
        "glow-blue": "0 0 24px rgba(59, 130, 246, 0.4)",
      },
      backgroundImage: {
        "gradient-cta": "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
        "gradient-cta-hover": "linear-gradient(135deg, #9D74FF 0%, #F472B6 100%)",
        "gradient-spectral": "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)",
        "gradient-cosmic": "radial-gradient(ellipse at top, #1E1545 0%, #0B0819 70%)",
        "gradient-glass": "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.05)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
