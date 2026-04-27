import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', "system-ui", "sans-serif"],
        body: ['Fredoka', "system-ui", "sans-serif"],
      },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        team: {
          red: "hsl(var(--team-red))",
          "red-foreground": "hsl(var(--team-red-foreground))",
          blue: "hsl(var(--team-blue))",
          "blue-foreground": "hsl(var(--team-blue-foreground))",
          green: "hsl(var(--team-green))",
          orange: "hsl(var(--team-orange))",
          purple: "hsl(var(--team-purple))",
          teal: "hsl(var(--team-teal))",
        },
        block: {
          square: "hsl(var(--block-square))",
          rect: "hsl(var(--block-rect))",
          roof: "hsl(var(--block-roof))",
          funnel: "hsl(var(--block-funnel))",
          tower: "hsl(var(--block-tower))",
          castle: "hsl(var(--block-castle))",
          dome: "hsl(var(--block-dome))",
          trapezoid: "hsl(var(--block-trapezoid))",
          rhombus: "hsl(var(--block-rhombus))",
          lego: "hsl(var(--block-lego))",
        },
        stability: {
          good: "hsl(var(--stability-good))",
          warn: "hsl(var(--stability-warn))",
          bad: "hsl(var(--stability-bad))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pop-in": {
          "0%": { transform: "scale(0) rotate(-15deg)", opacity: "0" },
          "60%": { transform: "scale(1.15) rotate(5deg)" },
          "100%": { transform: "scale(1) rotate(0)", opacity: "1" },
        },
        "block-drop": {
          "0%": { transform: "translateY(-200px) rotate(-8deg)", opacity: "0" },
          "70%": { transform: "translateY(8px) rotate(2deg)", opacity: "1" },
          "85%": { transform: "translateY(-4px) rotate(-1deg)" },
          "100%": { transform: "translateY(0) rotate(0)", opacity: "1" },
        },
        "block-fall": {
          "0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(300px) rotate(45deg)", opacity: "0" },
        },
        "block-tumble": {
          "0%": { transform: "translate(0,0) rotate(0)", opacity: "1" },
          "30%": { transform: "translate(20px,40px) rotate(35deg)", opacity: "1" },
          "100%": { transform: "translate(80px,360px) rotate(220deg)", opacity: "0" },
        },
        "shake": {
          "0%,100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-10px) rotate(-3deg)" },
          "40%": { transform: "translateX(10px) rotate(3deg)" },
          "60%": { transform: "translateX(-8px) rotate(-2deg)" },
          "80%": { transform: "translateX(8px) rotate(2deg)" },
        },
        "wobble": {
          "0%,100%": { transform: "rotate(0)" },
          "25%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(5deg)" },
        },
        "bounce-soft": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "flash-success": {
          "0%,100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "hsl(var(--success) / 0.4)" },
        },
        "flash-error": {
          "0%,100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "hsl(var(--destructive) / 0.4)" },
        },
        "freeze-pulse": {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.08)", opacity: "0.9" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-20vh) rotate(0)", opacity: "1" },
          "100%": { transform: "translateY(120vh) rotate(720deg)", opacity: "0" },
        },
        "face-blink": {
          "0%,92%,100%": { transform: "scaleY(1)" },
          "95%,97%": { transform: "scaleY(0.1)" },
        },
        "face-tremor": {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-1px)" },
          "75%": { transform: "translateX(1px)" },
        },
        "face-shake": {
          "0%,100%": { transform: "translate(0,0) rotate(0)" },
          "20%": { transform: "translate(-1.5px,1px) rotate(-2deg)" },
          "40%": { transform: "translate(1.5px,-1px) rotate(2deg)" },
          "60%": { transform: "translate(-1px,1.5px) rotate(-1deg)" },
          "80%": { transform: "translate(1px,-1.5px) rotate(1deg)" },
        },
        "face-shake-strong": {
          "0%,100%": { transform: "translate(0,0) rotate(0)" },
          "15%": { transform: "translate(-3px,2px) rotate(-4deg)" },
          "35%": { transform: "translate(3px,-2px) rotate(4deg)" },
          "55%": { transform: "translate(-2px,3px) rotate(-3deg)" },
          "75%": { transform: "translate(2px,-3px) rotate(3deg)" },
        },
        "heart-rise": {
          "0%": { transform: "translate(-50%, 0) scale(0.4)", opacity: "0" },
          "20%": { transform: "translate(-50%, -8px) scale(1.1)", opacity: "1" },
          "100%": { transform: "translate(-50%, -36px) scale(1)", opacity: "0" },
        },
        "tower-sway": {
          "0%,100%": { transform: "rotate(calc(var(--wobble-angle, 0deg) * -1))" },
          "50%": { transform: "rotate(var(--wobble-angle, 0deg))" },
        },
        "spark-burst": {
          "0%": { transform: "translate(var(--sx,0), 0) scale(0.4)", opacity: "0" },
          "30%": { transform: "translate(var(--sx,0), -10px) scale(1.2)", opacity: "1" },
          "100%": { transform: "translate(var(--sx,0), -28px) scale(0.6)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
        "pop-in": "pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "block-drop": "block-drop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "block-fall": "block-fall 1s ease-in forwards",
        "block-tumble": "block-tumble 1.1s ease-in forwards",
        "shake": "shake 0.5s ease-in-out",
        "wobble": "wobble 0.6s ease-in-out",
        "bounce-soft": "bounce-soft 1.5s ease-in-out infinite",
        "flash-success": "flash-success 0.6s ease-out",
        "flash-error": "flash-error 0.6s ease-out",
        "freeze-pulse": "freeze-pulse 0.8s ease-in-out infinite",
        "confetti-fall": "confetti-fall 3s linear forwards",
        "face-blink": "face-blink 5s ease-in-out infinite",
        "face-tremor": "face-tremor 0.18s ease-in-out infinite",
        "face-shake": "face-shake 0.4s ease-in-out infinite",
        "face-shake-strong": "face-shake-strong 0.3s ease-in-out infinite",
        "heart-rise": "heart-rise 1.1s ease-out forwards",
        "tower-sway": "tower-sway 2.4s ease-in-out infinite",
        "spark-burst": "spark-burst 0.8s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
