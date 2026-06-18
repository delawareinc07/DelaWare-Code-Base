import type { Config } from 'tailwindcss'

// Pabblyn Metropolitan College brand. Navy Blue + Gold.
// These are the source of truth; the same values are mirrored as CSS
// variables in src/index.css for use outside Tailwind.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#001F3F', // Navy Blue
          navy: '#001F3F',
          gold: '#FFD700', // Gold
          dark: '#0C1B33', // Darker Navy
          light: '#F5F5F5', // Off-white
        },
      },
      fontFamily: {
        // Space Grotesk for display, Inter for body. Loaded in index.html.
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        brand: '12px',
      },
    },
  },
  plugins: [],
} satisfies Config
