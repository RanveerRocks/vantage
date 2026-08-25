import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F7FB',
        ink: '#111826',
        ultramarine: '#2440C9',
        // Vibrant accent family for the v3 colourful theme.
        violet: '#6D3BEB',
        cyan: '#0EA5B7',
        coral: '#EC4E86',
        amber: '#F59E0B',
        gold: '#B98A1F',
        // Text-safe gold: #B98A1F fails AA on light backgrounds (3.1:1);
        // use gold-deep (4.9:1) for text, gold for borders and markers.
        'gold-deep': '#8A6410',
        // Darkened secondary text for stronger readability.
        slate: '#48505F',
        hairline: '#E3E6E1',
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        card: '10px',
        chip: '6px',
      },
      // Barely-there elevation: hairline borders stay the primary edge,
      // shadows only whisper. Multi-stop so cards read as material, not glow.
      boxShadow: {
        soft: '0 1px 2px rgba(17, 24, 38, 0.05), 0 4px 12px rgba(17, 24, 38, 0.04)',
        lift: '0 2px 4px rgba(17, 24, 38, 0.05), 0 14px 32px rgba(17, 24, 38, 0.09)',
        drawer: '-12px 0 40px rgba(17, 24, 38, 0.12)',
        glow: '0 12px 34px -10px rgba(109, 59, 235, 0.4)',
        'glow-blue': '0 12px 34px -10px rgba(36, 64, 201, 0.42)',
      },
    },
  },
  plugins: [],
} satisfies Config
