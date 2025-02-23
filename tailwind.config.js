/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "3xl": "0 0 20px 5px rgba(0, 0, 0, 0.1)"
      },
      borderRadius: {
        "4xl": "2rem"
      }
    },
  },
  plugins: [],
}
