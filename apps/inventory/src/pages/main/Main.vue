<script setup>
import { inject, computed, ref, watch, onUnmounted, onMounted } from 'vue'
import { Table } from 'table'
import { tableStartupVars } from 'shared'
import { ActionButtons, Overlay } from 'layout'
import { configTable, configPivotTable } from './configTable'
import { configColumns, configPivotColumns } from './configColumns'
import { configButtons } from '../configButtons'
import SlideOverActions from '../slideOverActions/SlideOverActions.vue'

const router = inject('router')

const useGlobalStore = inject('useGlobalStore')

const inventoryStore = useGlobalStore('inventory')
const rapidStore = useGlobalStore('rapidStore')

const apiGrid = ref()

// Initializes the main inventory table variables in the rapidstore
const pivotTable = ref(false)

const key = tableStartupVars(inject)

const idThread = router.currentRoute.value?.query?.idThread
const actionThread = router.currentRoute.value?.query?.action

// For selected products on invoice
const invoiceItemSelected = rapidStore.reactiveProperty(`${idThread}-selected-items`, [])

const updateSelectedRows = () => {
    const ids = invoiceItemSelected.value.map(item => item.id)

    if (idThread) {
        apiGrid.value.deselectAll()

        apiGrid.value.forEachNode(node => {
            node.setSelected(false)

            if (ids.includes(node.data.id)) {
                node.setSelected(true)
            }
        })
    }
}

const loadingInventory = rapidStore.reactiveProperty(`${idThread}-inventory-overlay`, false)

rapidStore.$registerGlobalEvent('selectedRowsInventorySync', updateSelectedRows)

const columns = configColumns({ useGlobalStore, key, idThread })
const pivotColumns = configPivotColumns()

const buttons = configButtons({ useGlobalStore, key, idThread, actionThread, invoiceItemSelected })

const configuration = configTable({ apiGrid, useGlobalStore, key, idThread, actionThread, updateSelectedRows, invoiceItemSelected, pivotTable })
const pivotConfiguration = configPivotTable({ pivotTable })

const data = computed(() => inventoryStore.getData())

const isLoading = ref(true)

const unwatch = watch(() => inventoryStore.fetching, (nValue, oValue) => {
    if (inventoryStore.fetching) {
        apiGrid.value?.showLoadingOverlay()
    }

    if (!inventoryStore.fetching) {
        apiGrid.value?.hideOverlay()

        isLoading.value = false
    }

    apiGrid.value?.deselectAll()
})

onUnmounted(() => {
    unwatch()
})

onMounted(() => {
    if (data.value.length) {
        isLoading.value = false
    }
})
</script>

<template>
    <Overlay
        v-if="inventoryStore.fetching || loadingInventory"
        class="z-50" />

    <Table
        v-if="!pivotTable"
        :elements="data"
        :columns="columns"
        :config="configuration">
        <template v-if="!idThread" v-slot:start-buttons>
            <ActionButtons
                :items="buttons" />
        </template>

        <template v-if="idThread" v-slot:aditional-end-buttons>
            <ActionButtons
                :items="buttons" />
        </template>
    </Table>

    <Table
        v-if="pivotTable"
        :elements="data"
        :columns="pivotColumns"
        :config="pivotConfiguration" />

    <SlideOverActions
        :type="key" />
</template>
