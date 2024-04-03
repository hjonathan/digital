<script setup>
import { inject, ref, onMounted } from 'vue'
import { Table } from 'table'
import { tableStartupVars } from 'shared'
import { ActionButtons } from 'layout'
import { configTable } from './configTable'
import { configColumns } from './configColumns'
import { configButtons } from '../configButtons'
import SlideOverActions from '../slideOverActions/SlideOverActions.vue'

const router = inject('router')
const useGlobalStore = inject('useGlobalStore')

const rapidStore = useGlobalStore('rapidStore')
const inventoryStore = useGlobalStore('inventory')

const tabsStore = useGlobalStore('tabs')

const data = ref([])
const apiGrid = ref()

const key = tableStartupVars(inject)

const itemId = router.currentRoute.value.params.id

// Initializes the subitem table variables in the rapidstore
const columns = configColumns({ useGlobalStore, key })
const buttons = configButtons({ useGlobalStore, key })
const configuration = configTable({ apiGrid, useGlobalStore, key })

const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

rapidStore.$registerGlobalEvent('load-subitem-list', async () => {
    const response = await inventoryStore.getInventoryItem(itemId)

    if (response.success) {
        selectedRows.value = []

        data.value = response.data?.children ? response.data?.children : []

        // If the response does not include items, close the tab
        if (!data.value.length) {
            tabsStore.closeTab('inventory subitem')
        }
    }

    // If the item we are trying to access does not exist, close the tab
    if (!response.success && response.message === 'Item not found') {
        tabsStore.closeTab('inventory subitem')
    }
})

onMounted(async () => {
    rapidStore.$emitGlobalEvent('load-subitem-list')
})
</script>

<template>
    <Table
        :elements="data"
        :columns="columns"
        :config="configuration">
        <template v-slot:start-buttons>
            <ActionButtons :items="buttons" />
        </template>
    </Table>

    <SlideOverActions :type="key"/>
</template>
