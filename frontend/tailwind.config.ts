/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "../shared/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // YouTube Brand Colors
        youtube: {
          50: '#fff5f5',
          100: '#ffebeb',
          200: '#ffc1c1',
          300: '#ff9797',
          400: '#ff6d6d',
          500: '#ff0000', // Main YouTube Red
          600: '#e60000',
          700: '#cc0000',
          800: '#b30000',
          900: '#990000',
        },
        background: "var(--background-solid)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card-solid)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary-solid)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary-solid)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent-solid)",
          foreground: "var(--accent-foreground)",
        },
        success: {
          DEFAULT: "var(--success-solid)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning-solid)",
          foreground: "var(--warning-foreground)",
        },
        error: {
          DEFAULT: "var(--error-solid)",
          foreground: "var(--error-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive-solid)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
