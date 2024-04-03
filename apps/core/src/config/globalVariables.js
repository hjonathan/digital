/**
 * Global variables keys
 * @returns
 */
const serverUrl = import.meta.env.VITE_URL_SERVER

export const VARIABLES = {
    parameters: '_PARAMETERS',
    appVersion: '_APPVERSION',
    serverUrl
}

export const setGlobalVariable = (key, value) => {
    if (window) {
        window[key] = value
    }
}
