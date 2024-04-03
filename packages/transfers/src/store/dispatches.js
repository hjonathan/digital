import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/config'
import { cloneDeep } from 'lodash'

/**
 * Dispatch transfers Store
 */
export default defineStore('dispatches', () => {
    const data = ref()
    const fetching = ref(false)

    /**
     * Fetch data from API
     * @returns
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/dispatch-transfers')

        if (response.success) {
            data.value = response.data
        }

        fetching.value = false

        return response
    }

    const getData = () => {
        return cloneDeep(data.value)
    }

    /**
     * Get Transfer Item
     * @param {*} id
     * @returns
     */
    const getTransferItem = async (id) => {
        const response = await api.get(`/dispatch-transfers/${id}`)

        return response
    }

    return {
        data,
        fetch,
        fetching,
        getData,
        getTransferItem
    }
})
