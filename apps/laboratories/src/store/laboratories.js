import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

/**
 * laboratories store
 */
export default defineStore('laboratories', () => {
    const data = ref([])
    const fetching = ref(false)

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the laboratories data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/laboratories')

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
    * Get laboratory by id
     * @param {*} id
     * @returns
     */
    const getClientById = async (id) => {
        const response = await api.get(`/laboratories/${id}`)

        return response
    }

    return { data, setData, fetch, getData, getClientById }
})
