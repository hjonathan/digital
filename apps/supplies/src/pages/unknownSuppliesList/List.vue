<script setup>
import { inject, onMounted, ref, computed, watch } from 'vue'
import { configColumns } from './configColumns'
import { configTable } from './configTable'
import { configButtons } from './configButtons'
import { Table } from 'table'
import { ActionButtons, Overlay } from 'layout'
import { useSlideOver as useSlideComposable } from './useSlideOver'
import SlideOverActions from './SlideOverActions.vue'
import UnknownSuppliesListPDF from './UnknownSuppliesListPDF.vue'
import { useUnknownSuppliesList as useUnknownSuppliesListComposable } from './useUnknownSuppliesList'

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const unknownSuppliesStore = useGlobalStore('unknownSupplies')
const parametersStore = useGlobalStore('parameters')
const suppliesStore = useGlobalStore('supplies')

const useSlideOver = useSlideComposable()

const apiGrid = ref()
const selectedRows = ref([])
const isLoading = ref(true)

const thread = ref({
    idThread: router.currentRoute.value?.query?.idThread,
    action: router.currentRoute.value?.query?.action,
    vendorId: router.currentRoute.value?.query?.vendorId
})

const useUnknownSuppliesList = useUnknownSuppliesListComposable()

const data = computed(() => {
    const unknownSupplies = unknownSuppliesStore.data
    .filter(unknownSupply => !unknownSupply.process_id)
    .map(unknownSupply => ({
        ...unknownSupply,
        measure: parametersStore.data.find(measure => measure.id === unknownSupply.measure_id),
        category: parametersStore.data.find(category => category.id === unknownSupply.category_id),
        location: parametersStore.data.find(location => location.id === unknownSupply.location_id)
    }))

    return unknownSupplies
})

const columns = configColumns({ apiGrid, selectedRows })
const configuration = configTable({ apiGrid, selectedRows, thread })

onMounted(async () => {
    await unknownSuppliesStore.fetch()

    isLoading.value = false
})

const dataAfterFilter = ref()
const displayedColumns = ref()

const getDataAfterFilter = () => {
    dataAfterFilter.value = configuration.getFilteredData()

    displayedColumns.value = configuration.getDisplayedColumns()
}

watch(
    () => data.value,
    () => {
        selectedRows.value = []
    }
)

const buttons = configButtons({ useGlobalStore, apiGrid, selectedRows, thread, useSlideOver, isLoading, useUnknownSuppliesList, getDataAfterFilter, tableData: data })

const { configModal } = useUnknownSuppliesList
</script>

<template>
    <Component
        :is="configModal.component"
        :config="configModal" />

    <Overlay
        v-if="isLoading || parametersStore.fetching"
        class="z-50" />

    <Table
        v-if="!isLoading"
        :elements="data"
        :columns="columns"
        :config="configuration">
        <template v-slot:start-buttons>
            <ActionButtons
                :items="buttons" />
        </template>
    </Table>

    <SlideOverActions
        :use-slide-over="useSlideOver"
        :apiGrid="apiGrid" />

    <!-- PDF section -->
    <div class="hidden">
        <UnknownSuppliesListPDF
            :data="dataAfterFilter"
            :displayedColumns="displayedColumns" />
    </div>
</template>
