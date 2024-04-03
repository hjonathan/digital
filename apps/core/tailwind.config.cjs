/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const themeSwapper = require('tailwindcss-theme-swapper')

// The only required theme is `base`.
const themes = {
    themes: [
        // Base
        {
            name: 'base', // Every property used in other themes must exist in this theme.
            selectors: [':root'],
            theme: {
                colors: {
                    // Main colors
                    primary: colors.indigo,
                    secondary: colors.slate,

                    // Generic colors
                    success: colors.green,
                    warning: colors.yellow,
                    error: colors.red,
                    info: colors.blue,
                    neutral: colors.slate
                }
            }
        },

        // Cultivation
        {
            name: 'cultivation',
            selectors: ['.cultivation'],
            theme: {
                colors: {
                    primary: colors.teal
                }
            }
        },

        // Processing
        {
            name: 'processing',
            selectors: ['.processing'],
            theme: {
                colors: {
                    primary: colors.orange
                }
            }
        },

        // Breakdown
        {
            name: 'breakdown',
            selectors: ['.breakdown'],
            theme: {
                colors: {
                    primary: colors.sky
                }
            }
        },

        // Lab
        {
            name: 'lab',
            selectors: ['.lab'],
            theme: {
                colors: {
                    primary: colors.rose
                }
            }
        },
    ]
}

module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        '../../ui/**/*.{vue,js,ts,jsx,tsx}',
        '../../apps/**/*.{vue,js,ts,jsx,tsx}',
        '../../packages/**/*.{vue,js,ts,jsx,tsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["'Inter'", ...defaultTheme.fontFamily.sans]
            },
            maxWidth: {
                '8xl': '88rem'
            },
            screens: {
                '3xl': '1792px',
                '4xl': '2048px',
                '5xl': '2304px'
            }
        }
    },

    darkMode: 'media', // or 'media' or 'class'

    corePlugins: {
        container: false // disable `container` class
    },

    variants: {
        extend: {}
    },

    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/forms'),
        themeSwapper(themes),
    ]
}
