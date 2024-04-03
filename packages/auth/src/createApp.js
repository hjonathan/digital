import { createApp } from 'vue'
import Pages from './components'

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
            I18n: injector.i18nConfig
        },
        directives: {}
    }
}
