import { app } from '@/createApp'
import { createPinia, setActivePinia } from 'pinia'
import stores from './stores'

const pinia = createPinia()

// Sets the active Pinia and returns a store from the selected Pinia instance
const useStore = (id) => {
    setActivePinia(pinia)

    if (stores[id]) {
        return stores[id]()
    }

    return null
}

app.provide('useStore', useStore)

app.use(pinia)

export { pinia, useStore }
