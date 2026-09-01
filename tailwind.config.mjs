/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				neutral: {
					50: '#f8f6f2',
					100: '#f1eee7',
					200: '#e3ddd1',
					900: '#1a1a1a',
				},
				accent: '#d1b894',
			},
			fontFamily: {
				serif: ['"Playfair Display"', 'serif'],
				sans: ['Inter', 'sans-serif'],
				acumin: ['"Acumin Variable Concept"', 'sans-serif'],
			},
			transitionTimingFunction: {
				'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
			}
		},
	},
	plugins: [],
}

