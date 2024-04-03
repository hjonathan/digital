import { h, onMounted, inject, onUnmounted } from 'vue'
import { random } from 'lodash'

const providers = ['useStore', 'router', 'api', 'i18nConfig', 'use', 'directives']

/**
 * Wrapper entry packages
 * This file encapsulates the instantiation of a package.
 * handle vue instance, update providers, uses, initialize stores to share,
 * initialize events to listen for and mount vue instance in html tag
 */
export const EntryPackage = ({ component, id }, name) => ({
    name,
    setup (props, { emit }) {
        const idRandom = random(0, 1000000)

        const injector = providers.reduce((acc, value) => {
            acc[value] = inject(value)

            return acc
        }, {})

        const appSchema = component(injector, id)

        appProvide(appSchema.app, { router: injector.router, useGlobalStore: appSchema.provide.useGlobalStore || injector.useStore, api: injector.api })

        onMounted(() => initApp(appSchema).mount(`#entryPoint-${id}-${idRandom}`))

        onUnmounted(() => { appSchema.app.unmount() })

        return () => h('div', { id: `entryPoint-${id}-${idRandom}`, class: 'relative h-full' })
    }
})

/**
 * Initializes the app, to be able to use it from the CORE package, or use it individually
 * @param {*} appSchema
 *  {
 *       app:{AppVueInstance},
 *       provide: {
 *           useStore:{useStorePinia},
 *           pinia:{piniaInstance}
 *       },
 *       use: {
 *           useI18n:{i18nInstance}
 *       },
 *       config: {
 *           name: 'auth', {packageName}
 *           stores: {storesConfig}
 *       }
 *   }
 * @returns {AppVueInstance}
 */
export const initApp = (appSchema) => {
    appSchema.app.config.errorHandler = (err, instance, info) => {
        console.error(err)

        // if (err.message && err.message.includes('dynamically')) {
        //     window.location.href = '/'
        // }
    }

    appProvide(appSchema.app, appSchema.provide)

    appUse(appSchema.app, appSchema.use)

    appDirectives(appSchema.app, appSchema.directives)

    return appSchema.app
}

/**
 * Add all the providers in the app vue instance
 * @param {*} app
 * @param {*} provide
 */
export const appProvide = (app, provide) => {
    for (const key in provide) {
        if (Object.hasOwnProperty.call(provide, key)) {
            app.provide(key, provide[key])
        }
    }
}

/**
 * Add all the uses in the app vue instance
 * @param {*} app
 * @param {*} use
 */
export const appUse = (app, use) => {
    for (const key in use) {
        if (Object.hasOwnProperty.call(use, key)) {
            app.use(use[key])
        }
    }
}

/**
 * Add all directives in the app vue instance
 * @param {*} app
 * @param {*} directives
 */
export const appDirectives = (app, directives) => {
    for (const key in directives) {
        if (Object.hasOwnProperty.call(directives, key)) {
            app.directive(key, directives[key])
        }
    }
}

/**
 * Add all the components in the app vue instance
 * @param {*} app
 * @param {*} component
 */
export const appComponent = (app, component) => {
    for (const key in component) {
        if (Object.hasOwnProperty.call(component, key)) {
            app.component(component[key])
        }
    }
}
