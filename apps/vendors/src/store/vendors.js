import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/config'

/**
 * Vendors Store
 */
export default defineStore('vendors', () => {
    const data = ref([])

    const fetching = ref(false)

    /**
     * Fetch the vendors data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/vendors')

        fetching.value = false

        if (response && response.success) {
            data.value = response.data
        }

        return data.value
    }

    const getData = () => {
        return data.value
    }

    return {
        data,
        fetching,
        fetch,
        getData
    }
})
