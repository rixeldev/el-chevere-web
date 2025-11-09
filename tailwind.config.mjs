/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	safelist: [
    'bg-parallax-1',
    'bg-parallax-2',
    'bg-parallax-3',
    'bg-parallax-4',
    'bg-parallax-5',
    'bg-parallax-6',
    'bg-parallax-7',
  ],
	theme: {
		extend: {
			colors: {
				primary: '#f8fafc',
				secondary: '#cbd5e1',
				accent: '#60a5fa',
				main: '#3b82f6',
				back: '#0a0e27',
				danger: '#ef4444',
				success: '#10b981',
				warning: '#f59e0b',
				glass: {
					DEFAULT: 'rgba(255, 255, 255, 0.05)',
					light: 'rgba(255, 255, 255, 0.1)',
					dark: 'rgba(0, 0, 0, 0.3)',
				},
			},
			fontFamily: {
				sans: ['var(--font-inter)'],
			},
			backgroundImage: {
				'parallax-1': "url('/statics/parallax-1.webp')",
				'parallax-2': "url('/statics/parallax-2.webp')",
				'parallax-3': "url('/statics/parallax-3.webp')",
				'parallax-4': "url('/statics/parallax-4.webp')",
				'parallax-5': "url('/statics/parallax-5.webp')",
				'parallax-6': "url('/statics/parallax-6.webp')",
				'parallax-7': "url('/statics/parallax-7.webp')",
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
			},
			backdropBlur: {
				xs: '2px',
			},
			boxShadow: {
				'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
				'glow-lg': '0 0 40px rgba(59, 130, 246, 0.6)',
				'inner-glow': 'inset 0 0 20px rgba(59, 130, 246, 0.3)',
			},
			animation: {
				'gradient': 'gradient 15s ease infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			keyframes: {
				gradient: {
					'0%, 100%': {
						'background-size': '200% 200%',
						'background-position': 'left center'
					},
					'50%': {
						'background-size': '200% 200%',
						'background-position': 'right center'
					},
				},
				shimmer: {
					'0%': {
						'background-position': '-1000px 0'
					},
					'100%': {
						'background-position': '1000px 0'
					},
				},
				float: {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-20px)'
					},
				},
			},
		},
	},
	plugins: [],
}
