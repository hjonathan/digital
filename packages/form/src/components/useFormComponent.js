export function useFormComponent () {
    let finalClasses = ''

    for (const style of document.getElementsByTagName('style')) {
        if (style.innerText.includes('==========')) {
            finalClasses = style.textContent.replace(/[\r\n]+/gm, ' ').replace(/[\/]+/gm, '')
        }
    }

    const styles = {
        body: {
            'font-size': '11px'
        },
        '.print-text-base': {
            'font-size': '12px !important',
            'line-height': '16px !important'
        },
        '.print-text-base-sm': {
            'font-size': '9px !important',
            'line-height': '10px !important'
        },
        '.print-text-base-md': {
            'font-size': '10px !important',
            'line-height': '13px !important'
        },
        '.text-2xl': {
            'font-size': '14px !important',
            'line-height': '13px !important'
        },
        '.print-custom-leading': {
            'line-height': '.65rem !important'
        },
        '.print-tiny-icon': {
            width: '20px !important'
        },
        '.print-reset-padding-bottom': {
            'padding-bottom': '0rem !important'
        },
        '.print-reset-padding-right': {
            'padding-right': '0rem !important'
        },
        '.print-reset-mt': {
            'margin-top': '0 !important'
        },
        '.print-reset-py': {
            'padding-top': '0rem !important',
            'padding-bottom': '0rem !important'
        },
        '.print-use-all-columns': {
            'grid-column': 'span 12 / span 12'
        },
        '.print-text-black': {
            color: 'black !important'
        },
        '.print-no-underline': {
            'text-decoration-line': 'none !important'
        }
    }

    const styleToString = (style) => {
        return Object.keys(style).reduce((acc, key) => (
            acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + '; '
        ), '')
    }

    const finalStyles = Object.keys(styles).map(key => `${key} { ${styleToString(styles[key])} }`).join(' ') + ' ' + finalClasses

    return {
        styles,
        ...styles,
        finalStyles
    }
}
