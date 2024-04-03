import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/config'
import { cloneDeep } from 'lodash'

/**
 * Supplies Labels store
 */

export default defineStore('suppliesLabels', () => {
    const data = ref([])
    const label = ref()

    const setLabel = (nLabel) => {
        label.value = nLabel
    }

    const fetch = async () => {
        const response = await api.post('labels/labels_by_group', {
            labelGroupSlug: 'supplies'
        })

        if (response.success) {
            data.value = response.data
        }
    }

    const getData = () => {
        return cloneDeep(data.value)
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

    return {
        setLabel,
        fetch,
        getData,
        remove,
        post,
        getItemLabel
    }
})
