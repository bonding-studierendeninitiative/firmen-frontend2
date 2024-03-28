/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./src/lib/@svelte',
		'./src/routes/+layout.svelte',
		'./src/routes/+page.svelte',
		'./src/routes/(app)',
		'./src/routes/(auth)'
	],
	theme: {
		extend: {
			borderWidth: {
				1: '1px'
			},
			colors: {
				brand: '#007EC7',
				error: '#EF4444'
			},
			textColor: {
				brand: '#007EC7'
			},
			width: {
				84: '21rem',
				98: '24.5rem'
			},
			padding: {
				22: '5.5rem'
			},
			fontFamily: {
				sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif']
			},
			fontSize: {
				'3xl': '2rem'
			},
			fontWeight: {
				'semi-light': 400
			},
			boxShadow: {
				custom: '0px 4px 8px -2px rgba(16, 24, 40, 0.06)'
			},
			borderRadius: {
				custom: '1.25rem'
			}
		}
	},
	plugins: []
};
