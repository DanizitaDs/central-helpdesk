import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        sans: ['Outfit', 'system-ui', 'sans-serif'],
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
        spotify: {
          green: "hsl(141 76% 48%)",
          black: "hsl(0 0% 0%)",
          dark: "hsl(0 0% 7%)",
          gray: "hsl(0 0% 18%)",
          light: "hsl(0 0% 65%)",
        },
        status: {
          open: "hsl(var(--status-open))",
          "open-bg": "hsl(var(--status-open-bg))",
          "in-progress": "hsl(var(--status-in-progress))",
          "in-progress-bg": "hsl(var(--status-in-progress-bg))",
          resolved: "hsl(var(--status-resolved))",
          "resolved-bg": "hsl(var(--status-resolved-bg))",
          cancelled: "hsl(var(--status-cancelled))",
          "cancelled-bg": "hsl(var(--status-cancelled-bg))",
        },
        priority: {
          low: "hsl(var(--priority-low))",
          "low-bg": "hsl(var(--priority-low-bg))",
          medium: "hsl(var(--priority-medium))",
          "medium-bg": "hsl(var(--priority-medium-bg))",
          high: "hsl(var(--priority-high))",
          "high-bg": "hsl(var(--priority-high-bg))",
          critical: "hsl(var(--priority-critical))",
          "critical-bg": "hsl(var(--priority-critical-bg))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(141 76% 48% / 0.4)",
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(141 76% 48% / 0.6)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      boxShadow: {
        'card': '0 4px 60px rgb(0 0 0 / 0.5)',
        'card-hover': '0 8px 80px rgb(0 0 0 / 0.6)',
        'elevated': '0 16px 100px rgb(0 0 0 / 0.7)',
        'glow': '0 0 40px hsl(141 76% 48% / 0.3)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
