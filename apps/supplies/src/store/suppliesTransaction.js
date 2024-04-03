import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/config'
import { clone, cloneDeep } from 'lodash'

/**
 * Example Store
 */
export default defineStore('suppliesTransaction', () => {
    const data = ref([])

    const fetching = ref(false)

    /**
     * Fetch the vendors data from API
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/supplies/supply_cost_transaction_list')

        fetching.value = false

        if (response && response.success) {
            data.value = response.data
        }
    }

    const getData = () => {
        return data.value
    }

    const getItemById = (id) => {
        const dataClone = cloneDeep(data.value)

        return dataClone.find((e) => e.id == id)
    }

    /**
     * Returns data based in slud ID for treeSelect component.
     * @param {*} slug Slug of the parameters to be searched.
     * @returns Parameter list that contains this slug.
     */
    const getTreeSelectData = (slug, selectableParent = false) => {
        const dataClone = clone(data.value)

        const filteredData = formatTreeSelect(groupByParentId(dataClone), selectableParent)

        // const response = filteredData.find((e) => e.data.slug === slug)

        return filteredData || []
    }

    function groupByParentId (array) {
        const groups = {}
        const rootElements = []

        array.forEach((itemSource) => {
            const item = clone(itemSource)
            const key = item.parent_id

            if (!key) {
                rootElements.push(item)

                return
            }

            groups[key] && groups[key].push(item)

            !groups[key] && (groups[key] = [item])
        })

        grouping(rootElements, groups)

        return rootElements
    }

    const formatTreeSelect = (elements, selectableParent = false) => {
        elements.forEach((element, key) => {
            // without children
            if (!element.children || !element.children.length) {
                delete elements[key]

                elements[key] = {
                    key: element.id,
                    id: element.id,
                    data: element,
                    label: element.name,
                    isSelectable: true
                }
            }

            // with children
            if (element.children && element.children.length) {
                const children = element.children

                delete elements[key]

                delete element.children

                elements[key] = {
                    key: element.id,
                    id: element.id,
                    data: element,
                    children,
                    label: element.name,
                    isSelectable: selectableParent
                }

                formatTreeSelect(children, selectableParent)
            }
        })

        return elements
    }

    function grouping (rootElements, groups) {
        rootElements.forEach((e) => {
            const subGroup = groups[e.id]

            if (subGroup) {
                !e.children && (e.children = [])

                e.children && (e.children = e.children.concat(Object.assign([], groups[e.id])))

                delete groups[e.id]

                grouping(subGroup, groups)
            }
        })
    }

    return {
        data,
        getData,
        getItemById,
        fetching,
        getTreeSelectData,
        fetch
    }
})
