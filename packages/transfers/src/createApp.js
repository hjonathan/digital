import { createApp } from 'vue'
import Pages from './pages'

const GOOGLE_MAP_ID = 'googleMapLibrary'
const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDpr6B79utf03ufcQwJd18pFMmRh-WRNxc&libraries=geometry'
/**
 * Returns config object to build the package
 * @param {Object} injector
 * @param {String} id
 * @returns
 */
export default (injector, id) => {
    const app = createApp(Pages[id])

    addGoogleMap()

    return {
        app,
        provide: {},
        use: {
            ...injector.use,
            I18n: injector.i18nConfig
        },
        directives: {}
    }
}

const addGoogleMap = () => {
    const element = document.getElementById(`${GOOGLE_MAP_ID}`)

    if (!element) {
        const vnode = document.createElement('script')
        vnode.src = GOOGLE_MAP_URL
        vnode.id = GOOGLE_MAP_ID

        document.getElementsByTagName('head')[0].appendChild(vnode)
    }
}
