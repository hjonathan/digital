import { defineStore } from 'pinia'
import { customRef, reactive, ref } from 'vue'

/**
 * Store that can be used quickly to store temporary values that can be shared between different views reactively.
 */
export default defineStore('rapidStore', () => {
    const refStore = ref({})
    const reactStore = reactive({})
    const rapidStore = {}

    const callbacks = {}

    const globalEvents = {}

    /**
     * Change values within this store non-reactively.
     * @param {*} id Identifier of the value stored in this store.
     * @param {*} value Value to be saved in this store, under the specified identifier.
     */
    const $set = (id, value) => {
        rapidStore[id] = value
    }

    /**
     * Gets value stored in this store with the corresponding identifier.
     * @param {*} id identifier of the value that is stored.
     * @returns Value stored in this store with the corresponding identifier.
     */
    const $get = (id) => {
        return rapidStore[id]
    }

    /**
     * Change values within this store reactively as reactive object.
     * @param {*} id Identifier of the value stored in this store.
     * @param {*} value Value to be saved in this store, under the specified identifier.
     */
    const $setReactive = (id, value) => {
        reactStore[id] = value
    }

    /**
     * Gets value stored in this store with the corresponding identifier as reactive object.
     * @param {*} id identifier of the value that is stored.
     * @returns Value stored in this store with the corresponding identifier.
     */
    const $getReactive = (id) => {
        return reactStore[id]
    }

    /**
     * Remove the attribute from the reactive object stored in this store based on the identifier.
     * @param {*} id Identifier for attribute that will remove on reactive object.
     */
    const $removeReactive = (id) => {
        delete reactStore[id]
    }

    /**
     * Change values within this store reactively as ref object.
     * @param {*} id Identifier of the value stored in this store.
     * @param {*} value Value to be saved in this store, under the specified identifier.
     */
    const $setRef = (id, value) => {
        refStore.value[id] = value
    }

    /**
     * Gets value stored in this store with the corresponding identifier as ref object.
     * @param {*} id identifier of the value that is stored.
     * @returns Value stored in this store with the corresponding identifier.
     */
    const $getRef = (id) => {
        return refStore.value[id]
    }

    /**
     * Register new event callback on this store
     * @param {*} uid Event identifier to be registered
     * @param {*} handler Function that will be executed when calling its identifier
     */
    const $setCallback = (uid, handler) => {
        callbacks[uid] = handler
    }

    /**
     * Gets the event already registered based on an identifier.
     * @param {*} uid Identifier of the event that is registered
     */
    const $getCallback = (uid) => {
        return callbacks[uid]
    }

    const $registerGlobalEvent = (uid, handler) => {
        globalEvents[uid] = handler
    }

    const $getGlobalEvent = (uid) => {
        return globalEvents[uid]
    }

    const $removeGlobalEvent = (uid) => {
        delete globalEvents[uid]
    }

    const $emitGlobalEvent = (uid, params) => {
        const globalEvent = globalEvents[uid]

        if (globalEvent) {
            globalEvent(params)
        }
    }

    /**
     * Create a reactive property in this store, that sync data between components.
     * @param {*} value Default value for this property.
     * @param {*} propertyName Property name that shared between components
     * @returns Custom ref variable that's reactive.
     */
    const reactiveProperty = (propertyName, value, resetData = false) => {
        let newValue = $getReactive(propertyName)

        if (resetData || !newValue) {
            newValue = value

            $setReactive(propertyName, value)
        }

        !resetData && $setReactive(propertyName, newValue)

        return customRef((track, trigger) => {
            return {
                get () {
                    track()

                    return $getReactive(propertyName) || value
                },
                set (nValue) {
                    $setReactive(propertyName, nValue)

                    value = nValue

                    trigger()
                }
            }
        })
    }

    return {
        $set,
        $get,
        $setReactive,
        $getReactive,
        $setRef,
        $getRef,
        $removeReactive,
        $getCallback,
        $setCallback,
        reactiveProperty,
        // Global events
        $registerGlobalEvent,
        $getGlobalEvent,
        $removeGlobalEvent,
        $emitGlobalEvent
    }
})
