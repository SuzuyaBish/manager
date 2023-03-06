const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/lib/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purpleAccent: "#672ee3",
        greyText: "#878aa5",
      },
      fontFamily: {
        golos: ["Golos Text", "sans-serif"],
      },
    },
  },
  plugins: [],
};
