import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

/**
 * Drivers store
 */
export default defineStore('drivers', () => {
    const data = ref([])
    const fetching = ref(false)

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the drivers data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/drivers')

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
    * Get driver by id
     * @param {*} id
     * @returns
     */
    const getFacilityById = async (id) => {
        const response = await api.get(`/drivers/${id}`)

        return response
    }

    return { data, setData, fetch, getData, getFacilityById }
})
