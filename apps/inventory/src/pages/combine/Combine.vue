<script setup>
/**
 * Combines the selected items into a single item
 */

import { ref, inject, watch, computed } from 'vue'
import { Alert, Title, Button } from 'layout'
import { Table } from 'table'
import { Input, ShowValue, Treeselect, SelectCustomDate } from 'form'
import { uniq } from 'lodash'

import { formatDate } from 'shared'

import { configTable } from './configTable'
import { configColumns } from './configColumns'

// Inject global stores and services
const useGlobalStore = inject('useGlobalStore')
const inventoryStore = useGlobalStore('inventory')
const parametersStore = useGlobalStore('parameters')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const data = ref(inventoryStore.getDataCombine())

const api = inject('api')

const apiGrid = ref()

const selectedRows = ref([])

const errors = ref({})

const updatedAt = ref(null)

const enabledCombine = ref(false)

const isLoading = ref(false)

const router = inject('router')

// Configuring columns for the table
const columns = configColumns({ useGlobalStore })
const configuration = configTable({ apiGrid, selectedRows })

// Gets query parameter from the router
const type = router.currentRoute.value.query?.type

// Defines a structure to hold results for different properties
const results = ref({
    units: {
        label: 'Unit of measure',
        value: []
    },
    categories: {
        label: 'Categories',
        value: []
    },
    stages: {
        label: 'Stages',
        value: []
    },
    strains: {
        label: 'Strains',
        value: []
    }
})

// Component state
const dataToApi = ref({
    total: 0,
    quantity: 0,
    waste: 0,
    reason: null,
    location: null,
    evaporation: 0
})

// Watches changes in selected rows to update the combined data
watch(() => selectedRows, (n, o) => {
    dataToApi.value.total = 0

    for (const key in results.value) {
        if (Object.hasOwnProperty.call(results.value, key)) {
            results.value[key].value = []
        }
    }

    // Updates results and total quantity based on selected rows
    selectedRows.value.forEach((element) => {
        results.value.units.value.push(element.measure?.name)

        results.value.categories.value.push(element.category?.name)

        results.value.stages.value.push(element.stage?.name)

        results.value.strains.value.push(element.strain?.name)

        dataToApi.value.total = dataToApi.value.total + element.quantity

        dataToApi.value.quantity = dataToApi.value.total
    })

    // Checks if combination is enabled based in results
    enabledCombine.value = Object.values(results.value).reduce((responseBoolean, result) => {
        responseBoolean = uniq(result.value).length !== 1 ? false : responseBoolean

        return responseBoolean
    }, true)
}, { deep: true, flush: 'post' })

// Calculates evaporation
const evaporation = computed(() => {
    return dataToApi.value.total - dataToApi.value.quantity - dataToApi.value.waste
})

// Save function to submit the combined data
const save = async (button) => {
    isLoading.value = true

    // Determines API endpoint based on the type
    const endPoint = type === 'child' ? 'stock/combine_child' : 'stock/combine'

    // Extracts IDs of selected rows
    const ids = selectedRows.value.map((e) => e.id)

    // Sends data to the API
    const response = await api.post(endPoint, {
        ids,
        updated_at: updatedAt.value ? formatDate(updatedAt.value, 'utcDateTime') : null,
        evaporation: dataToApi.value.evaporation,
        quantity: dataToApi.value.quantity,
        waste: dataToApi.value.waste,
        reason_id: dataToApi.value.reason ? dataToApi.value.reason : null,
        location_id: dataToApi.value.location ? dataToApi.value.location : null
    })

    // Handles successful response
    if (response.success) {
        // Refreshes inventory data
        inventoryStore.fetch()

        // Refreshes inventory subitem data
        rapidStore.$emitGlobalEvent('load-subitem-list')

        // Resetes data in the store
        inventoryStore.setDataCombine([])

        // Closes the tab
        tabsStore.closeTab('inventory-combine')
    }

    isLoading.value = false

    // Handles errors in the response
    response.errors && (errors.value = response.errors)
}

// Closes the tab if there's no data
if (!data.value.length) {
    tabsStore.closeTab('inventory-combine')
}
/* v-if="!enabledCombine || selectedRows.length <=1 || !(evaporation >= 0)" */

const alertErrorMessage = computed(() => {
    if (selectedRows.value.length <= 1) {
        return 'Please select two or more items to combine.'
    }

    if (!(evaporation.value >= 0)) {
        return `Quantity plus waste should not exceed ${dataToApi.value.quantity} units.`
    }

    if (!enabledCombine.value) {
        return 'Units of measure, categories, stages, and strains must be equal for all items to be combined.'
    }

    return null
})
</script>

<template>
    <section>
        <!-- Warning message -->
        <Alert
            :has-close-button="false"
            type="warning"
            title="Please confirm you want to proceed"
            content="You can remove some items to satisfy the requirements." />

        <Title
            title="Combine" />

        <Table
            :elements="data"
            :columns="columns"
            :config="configuration" />

        <Title
            title="The following items must be equal"
            titleType="h2" />

        <!-- Two-column layout -->
        <div class="lg:flex gap-16">
            <!-- Left column: Displaying results -->
            <div class="flex-1 justify-start space-y-8">
                <div
                    v-for="(result, index) in results"
                    :key="index">
                    <ShowValue
                        justify-end
                        :label="result.label">
                        <span :class="uniq(result.value).length === 1 ? '!text-green-600' : '!text-red-600'">
                            {{ uniq(result.value).length === 1 }}
                        </span>
                    </ShowValue>
                </div>

                <hr class="air" />

                <!-- Total quantity -->
                <ShowValue
                    justify-end
                    :label="$t('Total')">
                    {{ dataToApi.total }} {{ selectedRows[0]?.measure?.name || results.units?.value[0]}}
                </ShowValue>
            </div>

            <!-- Right column: Input fields (Quantity, waste, reason & location), evaporation and save button -->
            <div class="flex-1">
                <!-- Quantity -->
                <Input
                    v-model="dataToApi.quantity"
                    inputClass="text-right !pr-16"
                    :type="'number'"
                    :step="'1'"
                    :min="'0'"
                    :errors="errors?.quantity"
                    :label="$t('Quantity')"
                    :inline-label-right="selectedRows[0]?.measure?.name || results.units?.value[0]" />

                <hr class="air" />

                <!-- Waste -->
                <Input
                    v-model="dataToApi.waste"
                    inputClass="text-right !pr-16"
                    :type="'number'"
                    :step="'1'"
                    :min="'0'"
                    :errors="errors?.waste"
                    :label="$t('Waste')"
                    inline-label-right="units" />

                <!-- Reason -->
                <Treeselect
                    :errors="errors?.reason_id"
                    v-model="dataToApi.reason"
                    :options="parametersStore.getTreeSelectDataBySlug('reasons')"
                    placeholder="Select Item"
                    label="Reason"
                    class="input" />

                <hr class="air" />

                <!-- Location -->
                <Treeselect
                    :errors="errors?.location_id"
                    v-model="dataToApi.location"
                    :options="parametersStore.getTreeSelectDataBySlug('locations')"
                    placeholder="Select Item"
                    label="Locataion"
                    class="input" />

                <hr class="air" />

                <!-- Evaporation -->
                <ShowValue
                    v-model="evaporation"
                    justifyEnd
                    :label="$t('Evaporation')" />

                <!-- Custom date -->
                <SelectCustomDate
                    :has-separators="false"
                    :errors="errors?.updated_at"
                    v-model="updatedAt" />

                <!-- Alert message -->
                <transition>
                    <Alert
                        v-if="alertErrorMessage"
                        type="danger"
                        :content="alertErrorMessage"
                        :hasCloseButton="false" />
                </transition>

                <!-- Save -->
                <Button
                    @click="save"
                    :disabled="!enabledCombine || selectedRows.length <=1 || !(evaporation >= 0)"
                    :loading="isLoading"
                    class="w-full mt-8"
                    color="primary"
                    label="Save" />
            </div>
        </div>
    </section>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
  opacity: 0 ;
}
</style>
