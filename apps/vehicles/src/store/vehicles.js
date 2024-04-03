import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

/**
 * Vehicles store
 */
export default defineStore('vehicles', () => {
    const data = ref([])
    const fetching = ref(false)

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the vehicles data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/vehicles')

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
    * Get vehicle by id
     * @param {*} id
     * @returns
     */
    const getVehicleById = async (id) => {
        const response = await api.get(`/vehicles/${id}`)

        return response
    }

    return { data, setData, fetch, getData, getVehicleById }
})
