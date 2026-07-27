/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#08090a',   // base background
        panel: '#101213',  // card / panel surface
        panel2: '#16191a', // raised panel
        ink: '#eceeec',    // primary text + bright borders/glow (the one bright tone)
        dim: '#6b7473',    // secondary text + subtle borders
        red: '#ff2d3a',    // the single color accent — alerts, live status, danger states only
        ok: '#39d97a',     // one-off exception: the password "confirmed" flash in the loading screen only
      },
      fontFamily: {
        display: ['"VT323"', 'monospace'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        scanlines:
          'repeating-linear-gradient(to bottom, rgba(236,238,236,0.035) 0px, rgba(236,238,236,0.035) 1px, transparent 1px, transparent 3px)',
        noise:
          'radial-gradient(circle at 20% 20%, rgba(236,238,236,0.05), transparent 40%), radial-gradient(circle at 80% 60%, rgba(236,238,236,0.04), transparent 40%)',
      },
      keyframes: {
        blink: { '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0 } },
        scan: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        flicker: {
          '0%, 92%, 100%': { opacity: 1 },
          '93%': { opacity: 0.4 },
          '95%': { opacity: 1 },
          '96%': { opacity: 0.3 },
          '97%': { opacity: 1 },
        },
        glitch: {
          '0%, 100%': { clipPath: 'inset(0 0 0 0)', transform: 'translate(0,0)' },
          '20%': { clipPath: 'inset(20% 0 60% 0)', transform: 'translate(-2px,0)' },
          '40%': { clipPath: 'inset(60% 0 10% 0)', transform: 'translate(2px,0)' },
          '60%': { clipPath: 'inset(10% 0 80% 0)', transform: 'translate(-1px,0)' },
          '80%': { clipPath: 'inset(80% 0 5% 0)', transform: 'translate(1px,0)' },
        },
        rise: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pop: { '0%': { opacity: 0, transform: 'scale(0.96)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        scan: 'scan 3.2s linear infinite',
        flicker: 'flicker 6s linear infinite',
        glitch: 'glitch 2.4s infinite linear alternate-reverse',
        rise: 'rise 0.6s ease-out both',
        pop: 'pop 0.5s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}
