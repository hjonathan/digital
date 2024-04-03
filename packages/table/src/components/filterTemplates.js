/**
 * File to register new custom filter templates
 */
let FILTER_TEMPLATE = {}

const registerFilterTemplate = (value) => {
    FILTER_TEMPLATE = { FILTER_TEMPLATE, ...value }
}

export {
    FILTER_TEMPLATE,
    registerFilterTemplate
}
