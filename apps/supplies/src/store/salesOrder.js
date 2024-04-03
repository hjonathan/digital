import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep } from 'lodash'
import { api } from '@/config'

export default defineStore('salesOrder', () => {
    const data = ref([])
    const request = ref()
    const schema = ref([])
    const fetching = ref(false)

    // Fetch the endpoints to get the column schema and parameter data.
    const fetch = async () => {
        await fetchSalesOrder()
    }

    // Gets the data from the API parameters.
    const fetchSalesOrder = async () => {
        fetching.value = true

        const response = await api.postWithoutToast('supplies/sales_order_list', {})

        if (response.success) {
            data.value = response.data
        }

        fetching.value = false

        return response
    }

    // Gets the data from the API parameters.
    const fetchRequestById = async (id) => {
        request.value = null

        const response = await api.get(`supplies/sales_order_show/${id}`)

        if (response.success) {
            request.value = response.data

            return response.data
        }

        return null
    }

    const getSchema = () => {
        return cloneDeep(schema.value)
    }

    const getData = () => {
        return cloneDeep(data.value)
    }

    const getRequest = () => {
        return cloneDeep(request.value)
    }

    const post = async (action, id) => {
        const response = await api.post(action, id)

        if (response && response.success) {
            fetch()
        }

        return response
    }

    const postWithoutToast = async (action, id) => {
        const response = await api.postWithoutToast(action, id)

        if (response && response.success) {
            fetch()
        }

        return response
    }

    return {
        data,
        schema,
        fetching,
        fetch,
        getSchema,
        getData,
        post,
        postWithoutToast,
        getRequest,
        fetchRequestById
    }
})
