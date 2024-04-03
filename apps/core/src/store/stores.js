import * as Modules from '@/register'
import core from './core'
import tabs from './tabs'
import rapidStore from './rapidStore'
import layoutManager from './layoutManager'

import { isFunction } from 'lodash'

const registered = {}

for (const key in Modules) {
    Object.assign(registered, Modules[key].stores)
}

const stores = {
    ...registered,
    core,
    tabs,
    rapidStore,
    layoutManager
}

export default stores

/**
 * Init Stores when enter to the app
 * @param {*} useStore
 */
export const initGlobalStores = ({ useStore }) => {
    for (const key in Modules) {
        const init = Modules[key].initStores

        if (isFunction(init)) {
            init(useStore)
        }
    }
}
