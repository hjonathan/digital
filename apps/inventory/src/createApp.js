import { createApp } from 'vue'
import Pages from './pages'

/**
 * Returns config object to build the package
 * @param {Object} globalInjector
 * @param {String} id
 * @returns
 */
export default (globalInjector, id) => {
    const app = createApp(Pages[id])

    return {
        app,
        provide: {},
        use: {
            ...globalInjector.use,
            I18n: globalInjector.i18nConfig
        },
        directives: {
            ...globalInjector.directives
        }
    }
}
