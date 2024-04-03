import * as Modules from '@/register'
import { isFunction } from 'lodash'
import { useRouter } from 'vue-router'

/**
 * Init tasks when enter to the app
 * @param {*} useStore
 */
export const initBefore = ({ useStore, api, app, router }) => {
    // Init Core before hook
    api.setConfig({ useStore })

    initEvents({ useStore, api, app, router })

    for (const key in Modules) {
        const init = Modules[key].initBefore

        if (init && isFunction(init)) {
            init({ useStore, api })
        }
    }
}

export const initEvents = ({ useStore, api, app, router }) => {
    const rapidStore = useStore('rapidStore')
    const coreStore = useStore('core')

    const layoutManagerStore = useStore('layoutManager')

    rapidStore.$registerGlobalEvent('globalAlert:show', payload => {
        const { type, content, time } = payload

        layoutManagerStore.setAlert({ type, content, show: true, closeButton: true, time: time || 5000 })
    })

    rapidStore.$registerGlobalEvent('globalAlert:hide', payload => {
        layoutManagerStore.setAlert({ show: false })
    })

    rapidStore.$registerGlobalEvent('force:logout:show', payload => {
        layoutManagerStore.showModalLogout()
    })

    rapidStore.$registerGlobalEvent('force:logout', payload => {
        layoutManagerStore.hideModalLogout()

        coreStore.setCredentials(null)

        setTimeout(() => {
            router.push({ name: 'logout' })
        }, 200)
    })
}
