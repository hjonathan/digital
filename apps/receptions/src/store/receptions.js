import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/config'
import { cloneDeep } from 'lodash'

export default defineStore('receptions', () => {
    const data = ref([])
    const fetching = ref()

    /**
     * Setter for lockTypes data.
     * @param {*} value
     */
    const setData = (value) => {
        data.value = value
    }

    const getData = () => {
        return cloneDeep(data.value)
    }

    /**
     * Fetch the endpoints to get the column schema and parameter data.
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/receptions')

        if (response.success) data.value = response.data

        fetching.value = false
    }

    return {
        data,
        fetching,
        setData,
        fetch,
        getData
    }
})
