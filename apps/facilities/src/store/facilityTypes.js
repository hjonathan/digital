import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

/**
 * Facilities store
 */
export default defineStore('facilityTypes', () => {
    const data = ref([])
    const fetching = ref(false)

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the facilities data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/facility-types')

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
    * Get facility by id
     * @param {*} id
     * @returns
     */
    const getFacilityTypeById = async (id) => {
        const response = await api.get(`/facility-types/${id}`)

        return response
    }

    return {
        data,
        setData,
        fetch,
        getData,
        getFacilityTypeById
    }
})
