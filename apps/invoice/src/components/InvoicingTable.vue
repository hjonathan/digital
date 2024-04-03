<script setup>
import { inject, computed, ref, watch, onUnmounted, onMounted } from 'vue'
import { Table } from 'table'
import { tableStartupVars } from 'shared'
import { ActionButtons, Overlay } from 'layout'
import { configTable } from './configTable'
import { configColumns } from './configColumns'
import { configButtons } from './configButtons'

const props = defineProps({
    type: {
        type: String,
        default: ''
    }
})

const selectedRows = ref([])

const useGlobalStore = inject('useGlobalStore')

const invoiceStore = useGlobalStore('invoicing')

const apiGrid = ref()

// Initializes the main inventory table variables in the rapidstore
const key = tableStartupVars(inject)

const columns = configColumns({ useGlobalStore, key })
const buttons = configButtons({ useGlobalStore, key, selectedRows, type: props.type })

const configuration = configTable({ apiGrid, useGlobalStore, key, selectedRows })

const data = computed(() => {
    return invoiceStore.getDataByType(props.type)
})

const unwatch = watch(() => invoiceStore.fetching, (nValue, oValue) => {
    invoiceStore.fetching && apiGrid.value?.showLoadingOverlay()

    !invoiceStore.fetching && apiGrid.value?.hideOverlay()

    apiGrid.value?.deselectAll()
})

onMounted(() => {
    invoiceStore.fetch()
})

onUnmounted(() => {
    unwatch()
})
</script>

<template>
    <Overlay v-if="invoiceStore.fetching" />

    <Table
        :elements="data"
        :columns="columns"
        :config="configuration">
        <template v-slot:start-buttons>
            <ActionButtons :items="buttons" />
        </template>
    </Table>
</template>
