import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clone, cloneDeep } from 'lodash'
import { api, setGlobalVariable, VARIABLES } from '@/config'

const rootOption = { key: 'root', data: { id: 'root' }, label: 'Root' }

export default defineStore('parameters', () => {
    const data = ref([])
    const schema = ref([])
    const fetching = ref(false)

    /**
     * Setter for parameters data.
     * @param {*} value
     */
    const setData = (value) => {
        data.value = value
    }

    /**
     * Fetch the endpoints to get the column schema and parameter data.
     */
    const fetch = async () => {
        fetching.value = true

        const response = await api.get('/parameters')

        if (response.success) {
            data.value = response.data

            setGlobalVariable(VARIABLES.parameters, convertToObject(data.value))
        }
        fetching.value = false
    }

    // Returns the value to be used in a select field
    const getSelectData = () => {
        const dataClone = clone(data.value)

        return [rootOption].concat(formatTreeSelect(groupByParentId(dataClone)))
    }

    // Create a parameter using the API, and update the data
    const create = async (payload) => {
        const response = await api.post('/parameters', payload)

        response.success && fetch()

        return response
    }

    // Update the parameter using the API, and update the data
    const update = async (payload) => {
        const response = await api.put(`/parameters/${payload.id}`, payload)

        response.success && fetch()

        return response
    }

    // Remove the parameter using the API, and update the data
    const remove = async (id) => {
        const response = await api.delete(`/parameters/${id}`)

        response.success && fetch()

        return response
    }

    /**
     * Returns data based in slud ID for treeSelect component.
     * @param {*} slug Slug of the parameters to be searched.
     * @returns Parameter list that contains this slug.
     */
    const getTreeSelectDataBySlug = (slug, selectableParent = false) => {
        const dataClone = clone(data.value)

        const filteredData = formatTreeSelect(groupByParentId(dataClone), selectableParent)

        const response = filteredData.find((e) => e.data.slug === slug)

        return response ? response.children : []
    }

    /**
     * Returns data based in slud ID for autocomplete component.
     * @param {*} slug Slug of the parameters to be searched.
     * @returns Parameter list that contains this slug.
     */
    const getAutocompleteDataBySlug = (slug) => {
        const dataClone = clone(data.value)

        const groupedData = groupByParentId(dataClone)

        if (!groupedData || !slug) return []

        const res = groupedData.find((e) => e.slug === slug)

        if (!res) return []

        const items = res.children.map((child) => {
            return { id: child.id, slug: child.slug, label: child.name, value: child.id }
        })

        return items
    }

    /**
     * Returns data based in slug ID
     * @param {*} slug
     * @returns Array
     */
    const getDataBySlug = (slug) => {
        const dataClone = cloneDeep(data.value)

        const elementSlug = dataClone.find((e) => e.slug === slug)

        if (!elementSlug) return []

        return dataClone.filter((e) => e.parent_id === elementSlug.id)
    }

    /**
     * Returns data based in slug ID
     * @param {*} slug
     * @returns Array
     */
    const getItemById = (id) => {
        const dataClone = cloneDeep(data.value)

        return dataClone.find((e) => e.id == id)
    }

    /**
     * Search recursively a parameter by id on parameter list.
     * @param {*} id Identifier for parameter to find.
     * @param {*} elements Parameter list for search
     * @returns If the element exists, returns the element. else it returns null.
     */
    const getElementById = (id, elements = data.value) => {
        if (!id) return null

        return elements.reduce((element, item) => {
            if (element) return element

            if (item.id.toString() === id.toString()) return item

            if (item.children) return getElementById(id, item.children)

            return null
        }, null)
    }

    // FORMATTERS

    /**
     * Groups list items by id.
     * @param {*} rootElements Elements list
     * @param {*} groups Groups list
     */
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

    /**
     * Groups list items by parent id.
     * @param {*} rootElements Elements list
     * @param {*} groups Groups list
     */
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

    /**
     * Groups list items recursively by parent object and childrens.
     * @param {*} rootElements Elements list
     * @param {*} groups Groups list
     */
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

    /**
     * Convert array data to object
     * @param {*} value
     * @returns
     */
    const convertToObject = (value) => {
        return value.reduce((newData, value) => {
            newData[value.id] = value
            return newData
        }, {})
    }

    return {
        getElementById,
        data,
        schema,
        setData,
        fetch,
        getDataBySlug,
        getItemById,
        getSelectData,
        create,
        update,
        remove,
        getTreeSelectDataBySlug,
        getAutocompleteDataBySlug
    }
})
