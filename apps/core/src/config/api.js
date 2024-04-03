import Api from 'api'
import { getJSON } from 'shared'

export const apiConfig = {
    // Prefix to build API url , if it is null, it is not added
    baseURL: import.meta.env.VITE_URL_BASE
}

// New instance of the Class API
const api = new Api(apiConfig)

const credentials = getJSON('credentials')

// Assigns credentials during initialization.
api.setCredentials(credentials)

export { api }
