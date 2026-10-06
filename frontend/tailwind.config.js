/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        grena: {
          DEFAULT: "#8f0010",
          2: "#b0101f",
          deep: "#5a000a",
        },
        ouro: {
          DEFAULT: "#efaa19",
          2: "#ffc94a",
        },
        marinho: {
          DEFAULT: "#001065",
          2: "#0a1f8f",
        },
        noite: {
          DEFAULT: "#040720",
          2: "#0a0f33",
          3: "#121a4a",
        },
        creme: {
          DEFAULT: "#f4efe2",
          2: "#e9e1cc",
        },
        tinta: "#0b0d1c",
        cinza: "#6b6f86",
      },
      fontFamily: {
        display: ["Extenda 20 Max", "Anton", "Oswald", "Impact", "sans-serif"],
        regal: ["Cinzel", "Trajan Pro", "serif"],
        serif: ["DM Serif Display", "Georgia", "serif"],
        body: ["Poppins", "system-ui", "-apple-system", "sans-serif"],
      },
      maxWidth: {
        wrap: "1320px",
      },
      borderColor: {
        "linha-escura": "rgba(255, 255, 255, 0.1)",
        "linha-clara": "rgba(11, 13, 28, 0.12)",
      },
    },
  },
  plugins: [],
};
