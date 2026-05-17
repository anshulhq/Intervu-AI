import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-up-d1":
          "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
        "fade-up-d2":
          "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
        "fade-up-d3":
          "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
        "fade-up-d4":
          "fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both",
        "sound-1": "soundWave 1.2s ease-in-out infinite",
        "sound-2": "soundWave 1.2s ease-in-out 0.2s infinite",
        "sound-3": "soundWave 1.2s ease-in-out 0.4s infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        soundWave: {
          "0%, 100%": { transform: "scaleY(0.4)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
