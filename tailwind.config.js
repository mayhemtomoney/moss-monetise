/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                moss: {
                    deep: '#6B7A3D',
                    DEFAULT: '#8B9A46',
                    light: '#A8B86D',
                },
                linen: {
                    DEFAULT: '#D2B48C',
                    light: '#E8DCC8',
                },
                cream: '#FDF8F0',
                bark: '#5D4E37',
                petal: '#E8A4B0',
                berry: '#8B4557',
            },
            fontFamily: {
                handwritten: ['Caveat', 'cursive'],
                body: ['Inter', 'sans-serif'],
                elegant: ['Playfair Display', 'serif'],
            },
            animation: {
                'float': 'float 4s ease-in-out infinite',
                'sway': 'sway 6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                sway: {
                    '0%, 100%': { transform: 'rotate(-2deg)' },
                    '50%': { transform: 'rotate(2deg)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
