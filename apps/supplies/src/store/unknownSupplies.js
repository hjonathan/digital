import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/config'
import { clone, cloneDeep } from 'lodash'

export default defineStore('unknownSupplies', () => {
    const data = ref([])

    const fetching = ref(false)

    /**
     * Fetch the vendors data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.post('/supplies/warehouse_receipt_unknown_supply_list')

        fetching.value = false

        if (response && response.success) {
            data.value = response.data

            return data.value
        }
    }

    const getData = () => {
        return cloneDeep(data.value)
    }

    return {
        data,
        getData,
        fetching,
        fetch
    }
})
