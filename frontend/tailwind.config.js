/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class", // Enable dark mode toggle via classes
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}", // Match all JSX/TSX files
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
