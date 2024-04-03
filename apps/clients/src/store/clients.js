import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

/**
 * Clients store
 */
export default defineStore('clients', () => {
    const data = ref([])
    const fetching = ref(false)

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the clients data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/clients')

        fetching.value = false

        if (response && response.success) {
            data.value = response.data
        }
    }

    /**
     * Returns the data's clone
     * @returns Array
     */
    const getData = () => {
        return cloneDeep(data.value)
    }

    /**
    * Get client by id
     * @param {*} id
     * @returns
     */
    const getClientById = async (id) => {
        const response = await api.get(`/clients/${id}`)

        return response
    }

    return { data, setData, fetch, getData, getClientById }
})
