import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/config'
import { cloneDeep, get } from 'lodash'

/**
 * Transfers Store
 */
export default defineStore('transfers', () => {
    const data = ref()
    const fetching = ref(false)

    /**
     * Fetch data from API
     * @returns
    */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/transfers')

        if (response.success) {
            data.value = response.data
        }

        fetching.value = false

        return response
    }

    const getData = () => {
        return cloneDeep(data.value)
    }

    const getFilteredData = (callback) => {
        if (!data.value) return []

        return cloneDeep(data.value).filter(callback)
    }

    /**
     * Get Transfer Item
     * @param {*} id
     * @returns
     */
    const getTransferItem = async (id) => {
        const response = await api.get(`/transfers/transfer_drafts/${id}`)

        return response
    }

    return {
        data,
        fetch,
        fetching,
        getData,
        getFilteredData,
        getTransferItem
    }
})
