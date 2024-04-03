/*
|--------------------------------------------------------------------------
| Locale
|--------------------------------------------------------------------------
|
| Integrates each module locales and main locales into a object.
|
| Combined locale is available through the entire application.
|
| Recomendation: Each module locale should start with its own namespace:
|
|     moduleLocaleNamespace: {
|         welcome: 'Welcome message',
|     },
|
| Recomendation: If not namespaced, at least consider unique names that will not be overwritten.
|
*/

import { app } from '@/createApp'
import * as Modules from '@/register'
import { createI18n } from 'vue-i18n'

import en from './en'
import es from './es'
import de from './de'

const mainLocales = {
    en,
    es,
    de
}

const addLocales = () => {
    const mainLocaleAndModuleLocales = mainLocales

    // Loop through modules
    Object.values(Modules).forEach(Module => {
        // Loop through locales
        Object.entries(mainLocales).forEach(([key, mainLocale]) => {
            // Add existing module locale to main locale
            if (Module.locales && Module.locales[key]) {
                mainLocaleAndModuleLocales[key] = Object.assign(Module.locales[key], mainLocaleAndModuleLocales[key])
            }
        })
    })

    return mainLocaleAndModuleLocales
}

const i18nConfig = createI18n({
    missingWarn: false, // Disable warnings for default language

    legacy: false, // Use Composition API

    globalInjection: true, // Use $t in Composition API

    locale: 'es',

    fallbackLocale: 'en',

    messages: addLocales()
})

app.use(i18nConfig)

app.provide('i18nConfig', i18nConfig)
