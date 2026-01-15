/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
			display: ['"Fredericka the Great"', 'cursive'],
			hand: ['"Patrick Hand"', 'cursive'],
  			mono: ['"JetBrains Mono"', 'monospace']
  		},
  		borderWidth: {
  			'3': '3px',
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
			sketch: {
				yellow: '#FFD23F',
				pink: '#EE4266',
				purple: '#540D6E',
				black: '#33272a',
			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			ring: 'hsl(var(--ring))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		boxShadow: {
  			sketch: '4px 4px 0px 0px #33272a',
  			'sketch-lg': '8px 8px 0px 0px #33272a',
			'sketch-sm': '2px 2px 0px 0px #33272a',
			none: '0 0 #0000',
  		},
  		keyframes: {
  			'sketch-bounce': {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-5px)' },
  			}
  		},
  		animation: {
  			'sketch-bounce': 'sketch-bounce 2s ease-in-out infinite',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
}