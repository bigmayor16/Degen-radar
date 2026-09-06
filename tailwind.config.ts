import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0E14',
        panel: '#121821',
        panelhi: '#1A2230',
        line: '#232C3B',
        muted: '#7B8794',
        fog: '#E7EAEE',
        signal: '#FFB020',
        growth: '#2DD4BF',
        danger: '#FF5C5C',
        kol: '#8B7CFF',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        sweep: 'sweep 3s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
