const { colors, fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ["./src/**/*.svelte", "./public/*.html"],
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      transparent: colors.transparent,
      primary: colors.gray[900],
      secondary: colors.gray[700],
      background: colors.gray[100]
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', ...fontFamily.sans]
      }
    }
  },
  variants: {
    boxShadow: ['focus-within']
  },
  plugins: []
};