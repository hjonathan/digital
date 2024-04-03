import { api } from '@/config'
import { ref } from 'vue'

export const formatDataResultGroup = (customFields, elements, key) => {
    for (const resultDetail of elements) {
        const groupExists = customFields.find(customField => customField.group === resultDetail.category_test?.name)

        !groupExists && customFields.push({ group: resultDetail.category_test?.name, items: [] })

        const groupPosition = customFields.findIndex(customField => customField.group === resultDetail.category_test?.name)

        if (groupPosition > -1) {
            const customField = {
                label: resultDetail.display_name,
                placeholder: resultDetail.display_name,
                disabled: resultDetail.extract === 1,
                value: resultDetail.percentage,
                measure: resultDetail.measure_test?.symbol,
                slug: resultDetail.slug,
                type: resultDetail.measure_test?.symbol !== 'text' ? 'number' : 'text',
                key
            }

            customFields[groupPosition].items.push(customField)
        }
    }
}

const errors = ref({})

export const loadData = async (id, numberTest, url) => {
    const apiData = {
        item_id: id,
        lab_result_number: numberTest || 1
    }

    url && (apiData.lab_result_url = url)

    const response = await api.post(`lab_results/${url ? 'extract_results' : 'register_results'}`, apiData)

    if (response.errors) {
        errors.value = response.errors
    }

    if (response.success) {
        const customFields = []

        formatDataResultGroup(customFields, response.data.laboratory_result.laboratory_result_details, 'laboratory_result')

        formatDataResultGroup(customFields, response.data.laboratory_test, 'laboratory_test')

        return customFields
    }

    return null
}

export { errors }
