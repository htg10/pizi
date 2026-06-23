import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pizi brand colors (navy + coral)
        ink: {
          50: '#f8f8f9', 100: '#eaeaef', 200: '#d3d4dd', 300: '#aeb0bf',
          400: '#82859b', 500: '#646880', 600: '#525468', 700: '#434555',
          800: '#3a3c49', 900: '#33343f', 950: '#0f2748',
        },
        coral: {
          50: '#fef3f2', 100: '#fee5e2', 200: '#fdcdc8', 300: '#fbaaa1',
          400: '#f87a6a', 500: '#ef5036', 600: '#dc3a1f', 700: '#b92e17',
          800: '#992a18', 900: '#7f291a', 950: '#451209',
        },
        cream: '#f6f5f1',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        display: ['var(--font-fraunces)', 'serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
