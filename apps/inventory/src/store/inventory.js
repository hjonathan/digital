import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cloneDeep, get, flow } from 'lodash'
import { api, VARIABLES } from '@/config'

/**
 * Inventory Store
 */
export default defineStore('inventory', () => {
    const data = ref([])
    const fetching = ref(false)
    const dataCombine = ref([])

    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the inventory data from API
     */
    const fetch = async (type = 'default') => {
        fetching.value = true

        const response = await api.get('/stock')

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
        return flow([cloneDeep, arrayParametersReplace])(data.value)
    }

    /**
     * Returns data filtered by a criterion and a property
     * @returns Array
     */
    const getDataByCriteria = (property, criteria) => {
        const dataClone = cloneDeep(data.value)

        return dataClone.filter(e => property && get(e, property) === criteria)
    }

    /**
     * Get Inventory Item
     * @param {*} id
     * @returns
     */
    const getInventoryItem = async (id) => {
        const response = await api.get(`/stock/${id}`)

        return {
            ...response,
            data: parametersReplace(response.data)
        }
    }

    /**
     * Get Inventory Items
     * @param {*} ids Id list for items to gets
     * @returns
     */
    const getInventoryItems = async (ids) => {
        const response = await api.post('/stock/items_data', { ids })

        return {
            ...response,
            data: arrayParametersReplace(response.data)
        }
    }

    const setDataCombine = (dt) => {
        dataCombine.value = dt
    }

    const getDataCombine = () => {
        return cloneDeep(dataCombine.value)
    }

    const parametersReplace = (data) => {
        const parameters = window[VARIABLES.parameters]

        return {
            ...data,
            stage: parameters[`${data?.stage_id}`],
            category: parameters[`${data?.category_id}`],
            brand: parameters[`${data?.brand_id}`],
            location: parameters[`${data?.location_id}`],
            measure: parameters[`${data?.measure_id}`],
            status: parameters[`${data?.status_id}`],
            strain: parameters[`${data?.strain_id}`],
            type: parameters[`${data?.type_id}`]
        }
    }

    const arrayParametersReplace = (data) => {
        if (!data) return

        return data.map(parametersReplace)
    }

    return {
        getInventoryItems,
        data,
        fetch,
        fetching,
        setData,
        getData,
        getDataByCriteria,
        getInventoryItem,
        dataCombine,
        setDataCombine,
        getDataCombine
    }
})
