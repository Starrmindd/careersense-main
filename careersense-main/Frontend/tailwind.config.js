/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0f0a",
        card: "#111711",
        primary: "#16a34a",
        accent: "#4ade80",
        muted: "#6b7280",
      },
    },
  },
  plugins: [],
}
