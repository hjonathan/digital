import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

/**
 * Facilities store
 */
export default defineStore('facilities', () => {
    const data = ref([])
    const userLoggedFacility = ref({})
    const userFacilities = ref([])
    const fetching = ref(false)

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the facilities data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/facilities')

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
    const getFacilityById = async (id) => {
        const response = await api.get(`/facilities/${id}`)

        return response
    }

    const fetchCountries = async () => {
        const response = await api.get('/countries')

        return response?.data || []
    }

    /**
     * Gets user's facilities
     * @param {*} userId Number user id
     */
    const fetchByUser = async (userId) => {
        fetching.value = true

        const response = await api.get(`/facilities/user_facilities/${userId}`)

        fetching.value = false

        if (response && response.success) {
            userFacilities.value = response.data
        }
    }

    /**
     * Returns the user facilities clone
     * @returns Array
     */
    const getDataByUser = () => {
        return cloneDeep(userFacilities.value)
    }


    const setUserLoggedFacility = (nFacility) => {
        userLoggedFacility.value = nFacility
    }

    return {
        data,
        setData,
        fetch,
        getData,
        getFacilityById,
        fetchCountries,
        fetchByUser,
        getDataByUser,
        setUserLoggedFacility
    }
})
