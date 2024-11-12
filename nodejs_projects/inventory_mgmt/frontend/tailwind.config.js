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
        "navbar-width": "82%"
      },
      fontFamily: {
        "reporting": ["Verdana", "sans serif"]
      }
    }
  },
  plugins: [],
}