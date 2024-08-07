/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                play: ['Play', 'sans-serif'],
                mono: ['Oxygen mono', 'monospace'],
                pashto: ['Noto Sans Arabic']
            },
        },
    },
    plugins: [],
}