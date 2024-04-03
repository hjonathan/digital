<script setup>
import { Table } from 'table'
import { ActionButtons } from 'layout'
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { configColumns } from './configColums'
import { configButtons } from './configButtons'
import { configTable } from './configTable'

const useGlobalStore = inject('useGlobalStore')
const receptionsStore = useGlobalStore('receptions')

const apiGrid = ref()
const selectedRows = ref([])

const columns = configColumns({ useGlobalStore })
const buttons = configButtons({ useGlobalStore, selectedRows })

const configuration = configTable({ apiGrid, useGlobalStore, selectedRows })

const data = computed(() => {
    return receptionsStore.getData()
})

// Watch driverStore while is fetching
const unwatch = watch(() => receptionsStore.fetching, () => {
    receptionsStore.fetching && apiGrid.value && apiGrid.value.showLoadingOverlay()

    !receptionsStore.fetching && apiGrid.value && apiGrid.value.hideOverlay()

    apiGrid.value && apiGrid.value.deselectAll()
})

// Unregister watch
onUnmounted(() => unwatch())

onMounted(async () => {
    await receptionsStore.fetch()
})
</script>

<template>
    <Table
        :elements="data"
        :columns="columns"
        :config="configuration">
        <template v-if="!idThread" v-slot:start-buttons>
            <ActionButtons :items="buttons" />
        </template>

        <template v-if="idThread" v-slot:aditional-end-buttons>
            <ActionButtons :items="buttons" />
        </template>
    </Table>
</template>
