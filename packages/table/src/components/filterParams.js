/**
 * File to register new custom filter params
 */
let FILTER_PARAMS = {}

const registerFilterParams = (value) => {
    FILTER_PARAMS = { FILTER_PARAMS, ...value }
}

export {
    FILTER_PARAMS,
    registerFilterParams
}
