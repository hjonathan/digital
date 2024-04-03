import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

/**
 * Labels Store
 */
export default defineStore('labels', () => {
    const data = ref([])
    const baseURLQr = `${api.baseURL}inventory/action`
    const label = ref()

    const setLabel = (nLabel) => {
        label.value = nLabel
    }

    const fetch = async () => {
        const response = await api.post('labels/labels_by_group', {
            labelGroupSlug: 'inventory'
        })

        if (response?.success) {
            data.value = response.data
        }
    }

    const post = async (action, id) => {
        const response = await api.post(`/labels/${action}`, id)

        return response
    }

    // Remove label using the API
    const remove = async (id) => {
        const response = await api.delete(`/labels/${id}`)

        response.success && fetch()

        return response
    }

    const getItemLabel = async (id) => {
        const response = await api.get(`/labels/${id}`)

        return response.data
    }

    const getData = () => {
        return cloneDeep(data.value)
    }

    return {
        data,
        fetch,
        getData,
        post,
        getItemLabel,
        baseURLQr,
        setLabel,
        label,
        remove
    }
})
