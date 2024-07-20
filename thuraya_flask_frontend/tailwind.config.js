/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        greenColor: "#7b9861",
        blueColor: "#2d3e50",
        lightGreen: "#b6db94da",
      },
    },
  },
  plugins: [],
}

