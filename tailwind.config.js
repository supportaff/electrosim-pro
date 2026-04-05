/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom ElectroSim brand colors
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
        danger:  '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
      },
      animation: {
        'flow': 'flowAnim 1.5s linear infinite',
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        flowAnim: {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
