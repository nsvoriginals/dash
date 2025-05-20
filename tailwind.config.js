/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     fontFamily: {
        Tensor: ['"Tensor"', 'sans-serif'], // Make sure it's a string and wrapped in quotes
      },
    },
  },
  plugins: [],
}

