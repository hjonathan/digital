import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep, get } from 'lodash'
import { api } from '@/config'
import { showUuid } from 'shared'

/**
 * Inventory Store
 */
export default defineStore('labResults', () => {
    const data = ref([])
    const fetching = ref(false)

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the inventory data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/lab_results')

        fetching.value = false

        if (response && response.success) {
            data.value = response.data
        }

        return response
    }

    const getTreeData = () => {
        let response = cloneDeep(data.value)

        response = response.reduce((acc, value) => {
            if (value.item_laboratory_results.length >= 1) {
                value.item_laboratory_results.forEach(e => {
                    acc.push({
                        ...cloneDeep(e.lab_result_number !== 1 ? {} : value),
                        moisture: e.moisture,
                        total_cbd: e.total_cbd,
                        total_thc: e.total_thc,
                        safety_result: e.safety_result,
                        lab_custom_number: e.lab_result_number !== 1 ? [value.id, e.lab_result_number] : [value.id],
                        lab_result_number: e.lab_result_number,
                        id_item: value.id,
                        laboratory_pass: e.laboratory_pass,
                        item_laboratory_results: value.item_laboratory_results,
                        status: value.status

                    })
                })
            } else {
                acc.push({
                    ...value,
                    moisture: null,
                    total_cbd: null,
                    total_thc: null,
                    safety_result: null,
                    lab_custom_number: [value.id]
                })
            }

            return acc
        }, [])

        return response
    }

    const getData = () => {
        return cloneDeep(data.value)
    }

    return {
        data,
        fetch,
        fetching,
        setData,
        getData,
        getTreeData
    }
})
