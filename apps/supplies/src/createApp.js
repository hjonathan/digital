import { createApp, h } from 'vue'
import Pages from './pages'

/**
 * Returns config object to build the package
 * @param {Object} injector
 * @param {String} id
 * @returns
 */
export default (injector, id) => {
    const app = createApp(Pages[id])

    return {
        app,
        provide: {},
        use: {
            ...injector.use,
            I18n: injector.i18nConfig
        },
        directives: {
            ...injector.directives
        }
    }
}
