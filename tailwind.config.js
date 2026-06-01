/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Deep cyber palettes
        cyber: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
          accent: '#2563EB', // Tech Blue accent
          success: '#10B981', // Emerald
          warning: '#F59E0B', // Amber
          error: '#EF4444', // Red
          info: '#3B82F6', // Blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Outfit', 'Fira Code', 'monospace'],
      },
      fontSize: {
        xxs: ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-accent': '0 8px 32px 0 rgba(37, 99, 235, 0.2)',
      }
    },
  },
  plugins: [],
}
