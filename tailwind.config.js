/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: '#007EC7'
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
			}
		}
	},
	plugins: []
};
