/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", "./index.html"
  ],
  theme: {
    extend: {
      height: {
        "login-height": "500px"
      },
      width: {
        "sidebar-width": "18%",
        "navbar-width": "81.5%"
      },
      fontFamily: {
        "reporting": ["calibri", "sans serif"]
      }
    },
  },
  plugins: [],
}