module.exports = {
    darkMode: 'class',
    theme: {
        extend: {
            animation: {
                'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
                'blink': 'blink 1s step-end infinite',
            },
            keyframes: {
                heartbeat: {
                    '0%': { transform: 'scale(1)' },
                    '14%': { transform: 'scale(1.18)' },
                    '28%': { transform: 'scale(1)' },
                    '42%': { transform: 'scale(1.18)' },
                    '70%': { transform: 'scale(1)' },
                },
                blink: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                },
            },
            boxShadow: {
                'glow': '0 0 15px rgba(236, 72, 153, 0.5)'
            }
        },
    },
}