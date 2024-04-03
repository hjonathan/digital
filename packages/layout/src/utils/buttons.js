import { isFunction } from 'lodash'

/**
 * Checks if the list item is disabled.
 * @param {*} button List item for verification.
 */
export const show = (button) => {
    if (isFunction(button.show)) {
        return button.show()
    }

    if (button.show === false) {
        return false
    }

    return true
}

/**
 * Checks if the list item is disabled.
 * @param {*} button List item for verification.
 */
export const isDisabled = (button) => {
    if (isFunction(button.disabled)) {
        return button.disabled()
    }

    if (button.disabled === null || button.disabled === undefined || button.disabled === false) {
        return false
    }

    return true
}

/**
 * Checks if a list element is of type button or is of type separator.
 * @param {*} button List item for verification.
 */
export const isTypeButton = (button) => {
    if (button.type === null || button.type === undefined || button.type === 'button') {
        return true
    }

    return false
}

/**
 * Event set on each list item.
 * @param {*} button List item from which your configured event will be executed.
 * @param {*} data Data to send on execution function configured on button
 */
export const click = async (button, data = null) => {
    button.disabled = true
    button.spinner = true

    if (button.action) {
        await button.action(data)
    }

    button.disabled = false
    button.spinner = false
}
