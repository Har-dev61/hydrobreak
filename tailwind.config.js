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
        'intro-logo': 'introLogo 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'intro-subtitle': 'introSubtitle 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards',
        'intro-fade-out': 'introFadeOut 0.5s ease-in 2.2s forwards',
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
        introLogo: {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(12px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        introSubtitle: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '0.85', transform: 'translateY(0)' },
        },
        introFadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
