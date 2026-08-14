import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sakura: {
          50: "#fff5f8",
          100: "#ffe4ee",
          200: "#ffc9dd",
          300: "#ffa3c4",
          400: "#ff77a8",
          500: "#f8548e",
          600: "#e13a75",
          700: "#bd2960",
        },
        lilac: {
          50: "#f7f5ff",
          100: "#ede8ff",
          200: "#dcd3ff",
          300: "#c1b0ff",
          400: "#a382ff",
          500: "#8a5cf6",
          600: "#7440dd",
          700: "#5e2fb5",
        },
        skyy: {
          50: "#f0faff",
          100: "#dcf3ff",
          200: "#b9e7ff",
          300: "#87d5ff",
          400: "#4fbdff",
          500: "#22a3f5",
          600: "#1483d1",
          700: "#1268a8",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 6px)",
        "2xl": "calc(var(--radius) + 14px)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(142, 92, 246, 0.18)",
        card: "0 6px 20px -6px rgba(248, 84, 142, 0.15)",
        glow: "0 0 0 1px rgba(255,255,255,0.6), 0 20px 40px -12px rgba(138, 92, 246, 0.35)",
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #fff5f8 0%, #f7f5ff 45%, #f0faff 100%)",
        "card-gradient": "linear-gradient(160deg, #ffe4ee 0%, #ede8ff 100%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
