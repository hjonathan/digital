<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { Title, Button, ActionButtons, Overlay } from 'layout'
import { Input } from 'form'
import { showUuid, formatDate } from 'shared'
import { _ } from 'lodash'
import { useI18n } from 'vue-i18n'

import SvgIcon from '@jamescoyle/vue-icon'

import { mdiPackageVariant, mdiDownload } from '@mdi/js'
import { TrashIcon } from '@heroicons/vue/24/outline'

import axios from 'axios'

const { t } = useI18n()

const props = defineProps({
    useLabels: Object
})

// Inject necessary services
const useGlobalStore = inject('useGlobalStore')

// labelStore reference
const labelsStore = useGlobalStore('labels')
const rapidStore = useGlobalStore('rapidStore')

const isLoading = ref(false)

// Set the default quantity for label printing
const defaultQuantity = ref(1)

const errors = ref({})
const showAlertError = ref(false)
const showSuccessMessage = ref(false)

// Function to remove a product from the list
const removeProduct = (product, index) => {
    // Remove the product from the selected products and products to print
    props.useLabels.productsSelected.value.forEach(element => {
        if (element.id === product.id) {
            props.useLabels.productsToPrint.value.splice(index, 1)

            props.useLabels.productsSelected.value.splice(index, 1)

            // Change the step if there are no products to print
            if (props.useLabels.productsToPrint.value.length === 0) {
                props.useLabels.step.value = 'section_supplies'
            }
        }
    })
}

// Applies the default quantity to all products
const applyDefaultQuantity = () => {
    for (const product of props.useLabels.productsToPrint.value) {
        if (product.children_count && product.children) {
            for (const child of product.children) {
                child.quantityLabels = defaultQuantity.value
            }
        }

        if (!product.children_count && !product.children) {
            product.quantityLabels = defaultQuantity.value
        }
    }
}

onMounted(() => {
    props.useLabels.disableNextButton.value = true
})

// Action button
const buttons = computed(() => {
    return [
        {
            icon: mdiDownload,
            label: 'Download',
            type: 'button',
            classType: 'primary',
            spinner: isLoading.value,
            disabled: !props.useLabels.labelSelected.value || props.useLabels.isFetchQuantity.value || isLoading.value,
            spinnerColor: 'text-red-500',
            permission: 'supplies.labels.download',
            action: async (data, button) => {
                await save()
            }
        },
    ]
})

// Savev and downloads the label as a PDF
const save = async () => {
    isLoading.value = true

    showAlertError.value = false
    showSuccessMessage.value = false

    deleteErrors()

    // Prepare the final schema for label printing
    const finalSchema = {
        name: props.useLabels.labelSelected.value.name,
        height: props.useLabels.labelSelected.value.height,
        width: props.useLabels.labelSelected.value.width,
        pages: []
    }

    const labelSelectedElementsSchema = JSON.parse(props.useLabels.labelSelected.value.label_elements)

    for (const product of props.useLabels.productsToPrint.value) {
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
    // const res = await axios.post('http://127.0.0.1:8000/api/labels/print', finalSchema)
    // const response = res.data

    // If the API call is successful, download the PDF
    response.success && downloadPDF(response)

    isLoading.value = false

    // If there are errors, store them and show an alert
    if (response.errors) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

        errors.value = response.errors
    }
}

// Create label schema for a product
const createLabelProduct = (product, labelSchema) => {
    const productSchema = {
        quantity: product.quantityLabels,
        page: []
    }

    const processUuid = ['id', 'batch_id']

    for (let index = 0; index < labelSchema.length; index++) {
        const field = labelSchema[index]

        const pageSchema = { ...field }

        if (!pageSchema.text && pageSchema.element_id !== 'free_text') {
            // Find the value of the corresponding property in the product object
            pageSchema.text = _.get(product, pageSchema.element_id)

            /**
             * Special handling for certain fields
             */
            // For Full ID
            if (pageSchema.element_id === 'full_id') {
                pageSchema.text = _.get(product, 'id')
            }

            // Process Uuids
            if (processUuid.includes(pageSchema.element_id)) {
                pageSchema.text = showUuid(pageSchema.text)
            }

            if (pageSchema.element_id === 'created_at') {
                pageSchema.text = formatDate(pageSchema.text)
            }

            // For QR code
            if (pageSchema.element_id === 'qr_code') {
                pageSchema.text = `${labelsStore.baseURLQr}/${product.id}`
            }
        }

        pageSchema.content = pageSchema.text

        productSchema.page[index] = pageSchema
    }

    return productSchema
}

// Downloads the generated PDF
const downloadPDF = async (response) => {
    const linkSource = `data:application/pdf;base64,${response.data.content}`

    const downloadLink = document.createElement('a')

    const fileName = response.data.name

    downloadLink.href = linkSource

    downloadLink.download = fileName

    downloadLink.click()

    rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })
}

// Delete errors in the errors object
const deleteErrors = () => {
    for (const key in errors.value) {
        delete errors.value[key]
    }
}
</script>

<template>
    <!-- Header section -->
    <section>
        <Title
            title-type="h2"
            :hasBorderBottomLine="false"
            :title="$t('Set quantities')" />

        <p>{{ $t('Set quantities in every item.') }}</p>

        <!-- Section for displaying the products and quantities -->
        <div class="table-inside-stepper">
            <div class="flex justify-end items-center pr-4 bg-white w-full gap-12">
                <ActionButtons
                    :items="buttons" />
            </div>

            <!-- Table for displaying product details and quantities -->
            <table v-if="!useLabels.isFetchQuantity.value">
                <thead class="bg-white">
                    <!-- Row for setting default quantity for all rows -->
                    <tr>
                        <th colspan="4"></th>

                        <th colspan="2">
                            {{ $t('Set all rows') }}
                        </th>

                        <th>
                            <!-- Setting default quantity -->
                            <Input
                                v-model="defaultQuantity"
                                :inputClass="'text-right'"
                                type="number"
                                min="0"
                                step="1"
                                max="1000"
                                class="!mt-0 w-full" />
                        </th>

                        <th class="p-4">
                            <Button
                                @click="applyDefaultQuantity"
                                :label="$t('Apply')"
                                color="primary" />
                        </th>
                    </tr>
                </thead>

                <!-- Table header for individual product details -->
                <thead>
                    <tr>
                        <th class="w-[5%] text-start" />

                        <th class="w-[15%]">
                            {{ $t('Id') }}
                        </th>

                        <th class="w-[19%]">
                            {{ $t('Product name') }}
                        </th>

                        <th class="w-[19%]">
                            {{ $t('Location') }}
                        </th>

                        <th class="w-[11%]">
                            {{ $t('Category') }}
                        </th>

                        <th class="w-[11%]">
                            {{ $t('Measure') }}
                        </th>

                        <th class="w-[15%]">
                            {{ $t('Quantity') }}
                        </th>

                        <!-- Actions -->
                        <th class="w-[5%] notPrintableArea" />
                    </tr>
                </thead>

                <tbody>
                    <template
                        v-for="(product, index) in useLabels.productsToPrint.value"
                        :key="index">
                        <!-- Row for individual product -->
                        <tr>
                            <td class="w-[5%]">
                                <div class="w-full flex justify-center !h-min">
                                    <svg-icon
                                        :path="mdiPackageVariant"
                                        type="mdi"
                                        class="w-10 h-min" />
                                </div>
                            </td>

                            <td class="w-[15%]">
                                {{ showUuid(product.product_id || product.id) }}
                            </td>

                            <td class="w-[19%]">
                                {{ product.name }}
                            </td>

                            <td class="w-[19%] py-4">
                                {{ product.location?.name }}
                            </td>

                            <td class="w-[11%] py-4">
                                {{ product.category?.name }}
                            </td>

                            <td class="w-[11%] py-4">
                                {{ product.measure?.name }}
                            </td>

                            <td class="w-[15%]">
                                <!--  Sets the quantity of the product -->
                                <Input
                                    v-if="!product.children_count"
                                    v-model="product.quantityLabels"
                                    :errors="errors[`pages.${index}.quantity`] ? [] : null "
                                    :inputClass="'text-right'"
                                    type="number"
                                    min="0"
                                    step="1"
                                    max="100"
                                    class="!mt-0 w-full" />
                            </td>

                            <td class="w-[5%]">
                                <div class="flex justify-center">
                                    <!-- Removes the product -->
                                    <TrashIcon
                                        @click='removeProduct(product, index)'
                                        class="w-6 cursor-pointer text-gray-800 hover:text-red-400" />
                                </div>
                            </td>
                        </tr>

                        <!-- Rows for child products -->
                        <tr
                            v-for="(child) in product.children"
                            :key="child.id">
                            <td class="w-[5%]" />

                            <td class="w-[15%]">
                                {{ showUuid(child.product_id || child.id) }}
                            </td>

                            <td class="w-[19%] p-4">
                                {{ child.name }}
                            </td>

                            <td class="w-[19%] p-4">
                                {{ child.location?.name }}
                            </td>

                            <td class="w-[11%] p-4">
                                {{ child.category?.name }}
                            </td>

                            <td class="w-[11%] p-4">
                                {{ child.measure?.name }}
                            </td>

                            <td class="w-[15%]">
                                <!-- Input for setting quantity of the child product -->
                                <Input
                                    v-model="child.quantityLabels"
                                    :inputClass="'text-right'"
                                    type="number"
                                    min="0"
                                    step="1"
                                    max="1000"
                                    class="!mt-0 w-full" />
                            </td>

                            <td class="w-[5%]" />
                        </tr>
                    </template>
                </tbody>
            </table>

            <!-- Display an overlay with a loading message if no data is available or while loading -->
            <Overlay
                v-if="useLabels.isFetchQuantity.value"
                title="Loading" />
        </div>
    </section>
</template>

<style scoped>
.v-enter-active {
    transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
    opacity: 0;
}
</style>
