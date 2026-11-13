/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // light surfaces (white -> soft blue)
        ink: {
          950: '#ffffff',
          900: '#ffffff',
          850: '#f0f9ff',
          800: '#f0f9ff',
          700: '#e0f2fe',
        },
        // blue accent scale
        neon: {
          cyan: '#0284c7',
          violet: '#2563eb',
          pink: '#38bdf8',
          green: '#10b981',
        },
        // kept for the admin panel
        portfolio: {
          bg: '#ffffff',
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          'border-focus': '#7dd3fc',
          accent: '#0284c7',
          'accent-light': '#38bdf8',
          'accent-soft': '#e0f2fe',
          'accent-tint': '#f0f9ff',
          text: '#0f172a',
          muted: '#64748b',
          subtle: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        clean: '0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.05)',
        'soft-blue': '0 4px 20px -2px rgba(56,189,248,0.12), 0 2px 6px -1px rgba(56,189,248,0.08)',
        'hover-card': '0 10px 25px -5px rgba(2,132,199,0.1), 0 8px 10px -6px rgba(2,132,199,0.06)',
        glow: '0 0 0 1px rgba(2,132,199,0.18), 0 14px 40px -12px rgba(2,132,199,0.35)',
        'glow-violet': '0 0 0 1px rgba(37,99,235,0.18), 0 14px 40px -12px rgba(37,99,235,0.35)',
      },
      keyframes: {
        blink: { '0%,49%': { opacity: 1 }, '50%,100%': { opacity: 0 } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        scan: { '0%': { transform: 'translateY(-120%)' }, '100%': { transform: 'translateY(520%)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'fade-up': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'none' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        rise: { from: { opacity: 0, transform: 'translateY(60px) scale(0.96)' }, to: { opacity: 1, transform: 'none' } },
        pop: { from: { opacity: 0, transform: 'scale(0.6) translateY(10px)' }, to: { opacity: 1, transform: 'none' } },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        float: 'float 6s ease-in-out infinite',
        scan: 'scan 4s linear infinite',
        'spin-slow': 'spin-slow 14s linear infinite',
        'fade-up': 'fade-up .6s ease-out both',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
