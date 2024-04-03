import { getSessionJSON } from 'shared'
import axios from './axios'

const errorsLogout = [401]

export default class API {
    baseURL = ''
    prefix = null
    credentials = null
    requests = []
    useStore = null
    errorStastuses = [401]

    constructor (config) {
        this.setConfig(config)
    }

    addRequest (idRequest) {
        const existsRequest = this.requests.find(request => request.idRequest === idRequest)

        existsRequest && this.cancelRequest(idRequest)

        const abortController = new AbortController()

        this.requests.push({ idRequest, abortController })

        return abortController.signal
    }

    completeRequest (idRequest) {
        const requestIndex = this.requests.findIndex(request => request.idRequest === idRequest)

        if (requestIndex > -1) this.requests.splice(requestIndex, 1)
    }

    cancelRequest (idRequest) {
        const requestIndex = this.requests.findIndex(request => request.idRequest === idRequest)

        if (requestIndex > -1) this.requests[requestIndex].abortController.abort()

        this.completeRequest(idRequest)
    }

    /**
     * Set properties, based in object for example baseURL, prefix, credentials
     * @param {object} value
     */
    setConfig (payload) {
        for (const key in payload) {
            if (Object.hasOwnProperty.call(payload, key)) {
                this[key] = payload[key]
            }
        }
    }

    /**
     * Set credentials object, for example accessToken, refreshToken
     * @param {object} value
     */
    setCredentials (value) {
        this.credentials = value
    }

    /**
     * Build URL based in baseURL and services object
     * @param {string} service
     * @param {object} params
     * @returns
     */
    buildURL (service, params) {
        if (!this[service]) return ''

        let url = this[service]

        for (const key in params) {
            if (Object.hasOwnProperty.call(params, key)) {
                const element = params[key]

                url = url.replace(`{${key}}`, element)
            }
        }

        return url
    }

    /**
     * For more information https://axios-http.com/docs/req_config
     * @param {string} service
     * @param {string} method get, post, put, delete
     * @param {object} params object params for axios
     * @param {object} data object data for axios
     * @returns
     */
    api ({ service, method, params = {}, data = {} }) {
        const url = this.buildURL(service, params)

        return axios({
            url,
            method,
            baseURL: this.baseURL,
            mode: 'no-cors',
            headers: {
                'facility-id': getSessionJSON('facility_id'),
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.credentials?.access_token}`
            },
            params,
            data
        })
    }

    /**
     * Builds the Object for axios instance
     * @param {*} method
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    defaultConfig (method, action, payload, formData) {
        // When the action starts with / the url is not formed with the prefix otherwise use the url use the prefix
        let url = ''

        let baseURL = this.baseURL

        url = action && action[0] === '/' ? `${action}` : this.prefix ? `${this.prefix}/${action}` : `${action} `

        // This section is for consuming other URLs from axios
        if (action.includes('http')) {
            url = action

            baseURL = ''
        }

        return Object.assign({}, {
            method,
            url,
            baseURL,
            headers: {
                'facility-id': getSessionJSON('facility_id'),
                'Content-Type': formData ? 'multipart/form-data' : 'application/json',
                Authorization: `Bearer ${this.credentials?.access_token}`
            },
            signal: this.addRequest(action)
        }, payload)
    }

    /**
     * Manage the response of axios
     * @param {*} res
     * @returns
     */
    then () {
        return (res) => {
            const rapidStore = this.useStore('rapidStore')

            rapidStore.$emitGlobalEvent('updateVersion:compare', res)

            return res.data
        }
    }

    /**
     * Manage the response of axios that return a raw response
     * @param {*} res
     * @returns
     */
    thenRaw () {
        return (res) => {
            return res
        }
    }

    /**
     * Manage the response of axios withouth toast
     * @param {*} res
     * @returns
     */
    thenWithoutToast (action) {
        return (res) => {
            const rapidStore = this.useStore('rapidStore')

            rapidStore.$emitGlobalEvent('updateVersion:compare', res)

            this.completeRequest(action)

            return res.data
        }
    }

    /**
     * manages the errors of axios
     * @param {*} err
     * @returns
     */
    catch () {
        return (err) => {
            const rapidStore = this.useStore('rapidStore')

            if (errorsLogout.includes(err.response?.status)) rapidStore.$emitGlobalEvent('force:logout:show')

            return err.response?.data
        }
    }

    /**
     * Manage the response of axios withouth toast
     * @param {*} res
     * @returns
     */
    thenWithAlert (action) {
        return (res) => {
            const rapidStore = this.useStore('rapidStore')

            rapidStore.$emitGlobalEvent('updateVersion:compare', res)

            this.completeRequest(action)

            return res.data
        }
    }

    /**
     * Manages the errors of axios with error alert
     * @param {*} err
     * @returns
     */
    catchWithAlert () {
        return (err) => {
            const rapidStore = this.useStore('rapidStore')

            if (errorsLogout.includes(err.response?.status)) rapidStore.$emitGlobalEvent('force:logout:show')

            err.response?.data?.message && rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: err.response?.data?.message })

            return err.response?.data
        }
    }

    /**
     * manages the errors of axios
     * @param {*} err
     * @returns
     */
    catchWithoutToast (err) {
        const rapidStore = this.useStore('rapidStore')

        if (errorsLogout.includes(err.response?.status)) rapidStore.$emitGlobalEvent('force:logout:show')

        return err.response?.data
    }

    /**
     * Interface for get method axios
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    get (action, payload) { return axios(this.defaultConfig('get', action, { params: payload })).then(this.thenWithoutToast()).catch(this.catch()) }

    /**
     * Interface for get method axios that return original response
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    getRaw (action, payload) { return axios(this.defaultConfig('get', action, { params: payload })).then(this.thenRaw()).catch(this.catch()) }

    /**
     * Interface for post method axios
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    post (action, payload) {
        const rapidStore = this.useStore('rapidStore')

        rapidStore.$emitGlobalEvent('globalAlert:hide')

        return axios(this.defaultConfig('post', action, { data: payload })).then(this.then()).catch(this.catch())
    }

    /**
     * Interface for post method axios
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    postFormData (action, payload) {
        const rapidStore = this.useStore('rapidStore')

        rapidStore.$emitGlobalEvent('globalAlert:hide')

        return axios(this.defaultConfig('post', action, { data: payload }, true)).then(this.then()).catch(this.catch())
    }

    /**
     * Interface for post method axios that return original response
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    postRaw (action, payload) {
        const rapidStore = this.useStore('rapidStore')

        rapidStore.$emitGlobalEvent('globalAlert:hide')

        return axios(this.defaultConfig('post', action, { data: payload })).then(this.thenRaw()).catch(this.catch())
    }

    /**
     * Interface for post method axios
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    postWithoutToast (action, payload) {
        return axios(this.defaultConfig('post', action, { data: payload })).then(this.thenWithoutToast(action)).catch(this.catchWithoutToast)
    }

    /**
     * Interface for post method axios with error alert
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    postWithAlert (action, payload) {
        const rapidStore = this.useStore('rapidStore')

        rapidStore.$emitGlobalEvent('globalAlert:hide')

        return axios(this.defaultConfig('post', action, { data: payload })).then(this.thenWithAlert(action)).catch(this.catchWithAlert(action))
    }

    /**
     * Interface for post method axios
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    postSuccessToast (action, payload) {
        return axios(this.defaultConfig('post', action, { data: payload })).then(this.then()).catch(this.catchWithoutToast)
    }

    /**
     * Interface for put method axios
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    put (action, payload) { return axios(this.defaultConfig('put', action, { data: payload })).then(this.then()).catch(this.catch()) }

    /**
     * Interface for put method axios
     * @param {*} action
     * @param {*} payload
     * @returns
     */
    putWithoutToast (action, payload) { return axios(this.defaultConfig('put', action, { data: payload })).then(this.thenWithoutToast()).catch(this.catchWithoutToast) }

    /**
    * Interface for delete method axios
    * @param {*} action
    * @param {*} payload
    * @returns
    */
    delete (action, payload) { return axios(this.defaultConfig('delete', action, { data: payload })).then(this.then()).catch(this.catch()) }

    /**
    * Interface for delete method axios
    * @param {*} action
    * @param {*} payload
    * @returns
    */
    deleteWithoutToast (action, payload) { return axios(this.defaultConfig('delete', action, { data: payload })).then(this.thenWithoutToast()).catch(this.catchWithoutToast) }
}
