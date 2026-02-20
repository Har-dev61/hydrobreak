/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      transitionProperty: {
        'motion-reduce': 'none',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // 2026 SaaS: neutral backgrounds & surfaces (Notion/Linear/Stripe)
        app: {
          bg: 'var(--app-bg)',
          'bg-elevated': 'var(--app-bg-elevated)',
          border: 'var(--app-border)',
          'border-subtle': 'var(--app-border-subtle)',
          surface: 'var(--app-surface)',
          'surface-hover': 'var(--app-surface-hover)',
          muted: 'var(--app-muted)',
          'muted-foreground': 'var(--app-muted-foreground)',
          primary: 'var(--app-primary)',
          'primary-hover': 'var(--app-primary-hover)',
          'primary-muted': 'var(--app-primary-muted)',
        },
      },
      borderRadius: {
        card: '12px',
        'card-lg': '16px',
        input: '8px',
        button: '8px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        'soft-dark': '0 1px 2px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15)',
        card: '0 1px 3px rgba(0,0,0,0.05)',
        'card-dark': '0 1px 3px rgba(0,0,0,0.2)',
        modal: '0 24px 48px -12px rgba(0,0,0,0.18)',
        'modal-dark': '0 24px 48px -12px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16,1,0.3,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
