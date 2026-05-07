/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#667085",
        line: "#d9e1ec",
        surface: "#ffffff",
        wash: "#f5f7fb",
      },
      boxShadow: {
        panel: "0 8px 22px rgba(20, 32, 55, 0.04)",
        lift: "0 18px 45px rgba(20, 32, 55, 0.08)",
      },
      borderRadius: {
        ui: "8px",
      },
    },
  },
  plugins: [],
};
