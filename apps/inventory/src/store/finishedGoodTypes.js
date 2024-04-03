import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/config'
import { cloneDeep } from 'lodash'

export default defineStore('finishedGoodTypes', () => {
    const data = ref([])
    const fetching = ref()

    /**
     * Setter for lockTypes data.
     * @param {*} value
     */
    const setData = (value) => {
        data.value = value
    }

    const getDataTreeSelect = () => {
        return data.value.map((e) => {
            return {
                key: e.id,
                id: e.id,
                label: e.name,
                isSelectable: true,
                data: e
            }
        })
    }

    const getDataById = (id) => {
        return data.value.find(e => id === e.id)
    }

    const getData = () => {
        return cloneDeep(data.value).filter(e => !e.units_per_package)
    }

    /**
     * Fetch the endpoints to get the column schema and parameter data.
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/finished-good-types')

        if (response.success) data.value = response.data

        fetching.value = false
    }

    return {
        data,
        fetching,
        setData,
        fetch,
        getDataById,
        getDataTreeSelect,
        getData
    }
})
