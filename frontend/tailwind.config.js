/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  mode: "jit",
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "#212F49",
        secondary: "#025db8",
        tertiary: "#73737A",
      },
    },
    animation: {
      slideup: "slideup 1s ease-in-out",
      slidedown: "slidedown 1s ease-in-out",
      slideleft: "slideleft 1s ease-in-out",
      slideright: "slideright 1s ease-in-out",
      wave: "wave 1.2s linear infinite",
      slowfade: "slowfade 2.2s ease-in-out",
    },
    keyframes: {
      slowfade: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideup: {
        from: { opacity: 0, transform: "translateY(25%)" },
        to: { opacity: 1, transform: "none" },
      },
      slidedown: {
        from: { opacity: 0, transform: "translateY(-25%)" },
        to: { opacity: 1, transform: "none" },
      },
      slideleft: {
        from: { opacity: 0, transform: "translateX(-20px)" },
        to: { opacity: 1, transform: "translateX(0)" },
      },
      slideright: {
        from: { opacity: 0, transform: "translateX(20px)" },
        to: { opacity: 1, transform: "translateX(0)" },
      },
      wave: {
        "0%": { transform: "scale(0)" },
        "50%": { transform: "scale(1)" },
        "100%": { transform: "scale(0)" },
      },
    },
  
  },

  screens: {
    xs: "480px",
    ss: "620px",
    sm: "768px",
    md: "1060px",
    lg: "1200px",
    xl: "1700px",
  },
  plugins: [
  ],
};
