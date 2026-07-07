import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F8F6',
        ink: '#111826',
        ultramarine: '#2440C9',
        gold: '#B98A1F',
        // Text-safe gold: #B98A1F fails AA on light backgrounds (3.1:1);
        // use gold-deep (4.9:1) for text, gold for borders and markers.
        'gold-deep': '#8A6410',
        slate: '#5B6472',
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
      // shadows only whisper.
      boxShadow: {
        soft: '0 1px 2px rgba(17, 24, 38, 0.04)',
        lift: '0 4px 16px rgba(17, 24, 38, 0.07)',
      },
    },
  },
  plugins: [],
} satisfies Config
