const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				grey: colors.zinc,
				purple: {
					'500': '#AA56FA',
				}
			},
			fontFamily: {
				sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
				serif: ['Times New Roman', 'Times', 'serif']
			}
		},
	},
	plugins: [
		require('@domchristie/tailwind-utopia'),
		plugin(function ({ addVariant }) {
			addVariant('current', '&[aria-current="page"]')
		})
	],
}
