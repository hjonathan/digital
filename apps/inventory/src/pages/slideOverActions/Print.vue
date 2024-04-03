<script setup>
import { ref, onMounted, watch, inject } from 'vue'
import { api } from '@/config'
import { mdiCannabis } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { showUuid } from 'shared'
import { Alert } from 'layout'
import { AutoComplete, Input } from 'form'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

const emit = defineEmits(['disabledButton'])

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')
const labelsStore = useGlobalStore('labels')

const data = rapidStore.reactiveProperty(`selected-${props.type}-rows`)
const slideAction = rapidStore.reactiveProperty(`slide-${props.type}`)

const template = ref(null)
const quantity = ref(0)
const labelsData = ref([])
const errors = ref({})
const errorMessage = ref()

/**
 * Create a link for download the new file
 * @param {*} response
 */
const downloadPDF = async (response) => {
    const linkSource = `data:application/pdf;base64,${response.data.content}`

    const downloadLink = document.createElement('a')

    const fileName = response.data.name

    downloadLink.href = linkSource
    downloadLink.download = fileName

    downloadLink.click()
}

const save = async () => {
    if (!template.value || !quantity.value > 0) {
        return {}
    }

    deleteErrors()

    // Prepare the final schema for label printing
    const finalSchema = {
        name: template?.value?.name,
        height: template?.value?.height,
        width: template?.value?.width,
        pages: []
    }

    const productToPrint = { ...data.value[0], quantityLabels: quantity.value }

    const labelSelectedElementsSchema = JSON.parse(template?.value?.label_elements)

    for (const product of [productToPrint]) {
        // Create schema for each product (including children if any)
        if (product.children_count && product.children) {
            for (const child of product.children) {
                const childrenSchema = createLabelProduct(child, labelSelectedElementsSchema)

                finalSchema.pages.push(childrenSchema)
            }
        }

        // Create schema for individual product
        if (!product.children && !product.children_count) {
            const productSchema = createLabelProduct(product, labelSelectedElementsSchema)

            finalSchema.pages.push(productSchema)
        }
    }

    // Make an API call to print the label
    const response = await labelsStore.post('print', finalSchema)

    // If the API call is successful, download the PDF
    response.success && downloadPDF(response)

    // If there are errors, store them and show an alert
    if (response.errors) {
        errors.value = response.errors

        errorMessage.value = response?.message
    }

    return {}
}

/**
 * Create the Object formated to consume the api service
 */
const createLabelProduct = (product, labelSchema) => {
    const baseURLQr = `${api.baseURL}inventory/action`

    const productSchema = {
        quantity: product.quantityLabels,
        page: {}
    }

    const processUuid = ['id', 'batch_id']

    for (let index = 0; index < labelSchema.length; index++) {
        const field = labelSchema[index]

        const pageSchema = { ...field }

        if (!pageSchema.text && pageSchema.name !== 'Free text') {
            pageSchema.text = _.get(product, pageSchema.element_id)

            if (pageSchema.element_id === 'full_id') {
                pageSchema.text = _.get(product, 'id')
            }

            if (processUuid.includes(pageSchema.element_id)) {
                pageSchema.text = showUuid(pageSchema.text)
            }

            if (pageSchema.element_id === 'qr_code') {
                pageSchema.text = `${baseURLQr}/${product.id}`
            }
        }

        pageSchema.content = pageSchema.text

        productSchema.page[index] = pageSchema
    }
    return productSchema
}

// Remove elements errors
const deleteErrors = () => {
    errorMessage.value = null

    for (const key in errors.value) {
        delete errors.value[key]
    }
}

/**
 * Disables Save button when template and quantity properties do not populate correctly
 */
watch([() => quantity.value, () => template.value], () => {
    let disabled = true

    quantity.value > 0 && template.value?.id && (disabled = false)

    emit('disabledButton', disabled)
})

onMounted(() => {
    labelsData.value = labelsStore.getData()
})

emit('disabledButton', true)

defineExpose({ save })
</script>

<template>
    <!-- View for item information  with -->
    <ul
        role="list"
        class="grid air">
        <li
            v-for="item in data"
            :key="item.id"
            class="overflow-hidden rounded-xl border border-gray-200 mt-8">
            <div class="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-4">
                <svg-icon
                    type="mdi"
                    :path="mdiCannabis"
                    size="24" />

                <div class="text-sm font-medium leading-6 text-gray-900">
                    {{ showUuid(item.id) }}
                </div>
            </div>

            <dl class="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div class="flex justify-between gap-x-4 py-3">
                    <dt class="text-gray-500">{{ $t('Category')}}</dt>

                    <dd class="text-gray-700">
                        {{ item.category?.name }}
                    </dd>
                </div>

                <div class="flex justify-between gap-x-4 py-3">
                    <dt class="text-gray-500">{{ $t('Stage') }}</dt>

                    <dd class="text-gray-700">
                        {{ item.stage?.name }}
                    </dd>
                </div>

                <div class="flex justify-between gap-x-4 py-3">
                    <dt class="text-gray-500">{{ $t('Quantity') }}</dt>

                    <dd class="flex items-start gap-x-2">
                        <div class="font-medium text-gray-900">{{ item?.quantity }}  {{ item?.measure?.name }} </div>
                    </dd>
                </div>
            </dl>
        </li>
    </ul>

    <AutoComplete
        :label="t('Template')"
        v-model="template"
        :options="labelsData"
        :errors="errors?.name"
        :placeholder="t('Select a template')">
    </AutoComplete>

    <Input
        :label="t('Quantity')"
        v-model="quantity"
        inputClass="text-right"
        type='number'
        :step="1"
        :min="0"
        :errors="errors?.quantity" />

    <Alert
        v-if="errorMessage"
        class="air"
        type="danger"
        :hasCloseButton="false"
        :content="t(errorMessage)" />
</template>
