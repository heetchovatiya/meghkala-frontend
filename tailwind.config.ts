import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
     colors: {
        'primary-bg': '#F8F7F4',
        'secondary-bg': '#E9E4DE',
        'accent': '#E6A285',
        'accent-hover': '#D67D55',
        'heading-color': '#333333',
        'text-color': '#5A5A5A',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config