export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        neon: {
          bg: '#0a0e27',
          bgLight: '#12183a',
          pink: '#ff2a6d',
          cyan: '#05d9e8',
          yellow: '#f9c80e',
          green: '#00ff9d',
          orange: '#ff6b35',
          purple: '#d300c5',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 5px #ff2a6d, 0 0 20px #ff2a6d, 0 0 40px #ff2a6d',
        'neon-cyan': '0 0 5px #05d9e8, 0 0 20px #05d9e8, 0 0 40px #05d9e8',
        'neon-yellow': '0 0 5px #f9c80e, 0 0 20px #f9c80e, 0 0 40px #f9c80e',
        'neon-green': '0 0 5px #00ff9d, 0 0 20px #00ff9d, 0 0 40px #00ff9d',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'marquee': 'marquee 20s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #05d9e8, 0 0 10px #05d9e8' },
          '100%': { textShadow: '0 0 10px #05d9e8, 0 0 20px #05d9e8, 0 0 30px #05d9e8' },
        },
        marquee: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
};
