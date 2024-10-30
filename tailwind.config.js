/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#003A62",
        blue: "#1B78B9",
        "blue-100": "#CFE2FF",
        purple: "#63348F",
        dark: "#1C1C1C",
        "dark-100": "#4A4A4A",
        white: "#ffffff",
        black: "#000000",
        gray: "#F2F2F2",
        light: "#EDEDED",
        "light-50": "#F1F1F1",
        green: "#27A376",
        "green-100": "#D1E7DD",
        red: "#E03137",
      },
      fontFamily: {
        ManropeExtraLight: ["Manrope-ExtraLight", "sans-serif"],
        ManropeLight: ["Manrope-Light", "sans-serif"],
        ManropeRegular: ["Manrope-Regular", "sans-serif"],
        ManropeMedium: ["Manrope-Medium", "sans-serif"],
        ManropeSemibold: ["Manrope-SemiBold", "sans-serif"],
        ManropeBold: ["Manrope-Bold", "sans-serif"],
        ManropeExtraBold: ["Manrope-ExtraBold", "sans-serif"],
      },
      screens: {
        sm: "390px",
      },
    },
  },
  plugins: [],
};
