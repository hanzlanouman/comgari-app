/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#003A62",
        blue: "#1B78B9",
        purple: "#63348F",
        dark: "#1C1C1C",
        "dark-100": "#4A4A4A",
        white: "#ffffff",
        black: "#000000",
        gray: "#F2F2F2",
        light: "#EDEDED",
        green: "#27A376",
        red: "#E03137",
      },
      fontFamily: {
        ManropExtraLight: ["Manrope-ExtraLight", "sans-serif"],
        ManropLight: ["Manrope-Light", "sans-serif"],
        ManropRegular: ["Manrope-Regular", "sans-serif"],
        ManropMedium: ["Manrope-Medium", "sans-serif"],
        ManropSemibold: ["Manrope-SemiBold", "sans-serif"],
        ManropBold: ["Manrope-Bold", "sans-serif"],
        ManropExtraBold: ["Manrope-ExtraBold", "sans-serif"],
      },
      screens: {
        sm: "390px",
      },
    },
  },
  plugins: [],
};
