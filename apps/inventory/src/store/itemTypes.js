import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

/**
 * Item types Store
 */
export default defineStore('itemTypes', () => {
    const data = ref([])
    const fetching = ref(false)

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the item types from API
     */
    const fetch = async (type = 'default') => {
        fetching.value = true

        const response = await api.get('/item-types')

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

    return {
        data,
        fetch,
        fetching,
        setData,
        getData
    }
})
