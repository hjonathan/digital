<script setup>
import { inject, ref, computed, onUnmounted, watch } from 'vue'
import { Table } from 'table'
import { configTable } from './configTable'
import { configColumns } from './configColumns'
import { configButtons } from './configButtons'
import { ActionButtons } from 'layout'
import { tableStartupVars } from 'shared'

const useGlobalStore = inject('useGlobalStore')

const dispatchesStore = useGlobalStore('dispatches')

const apiGrid = ref()

const key = tableStartupVars(inject)

const configuration = configTable({ apiGrid, useGlobalStore, key })
const columns = configColumns({ useGlobalStore })
const buttons = configButtons({ useGlobalStore, key })

const unwatch = watch(() => dispatchesStore.fetching, (nValue, oValue) => {
    dispatchesStore.fetching && apiGrid.value && apiGrid.value.showLoadingOverlay()

    !dispatchesStore.fetching && apiGrid.value && apiGrid.value.hideOverlay()

    apiGrid.value && apiGrid.value.deselectAll()
})

onUnmounted(() => unwatch())

const data = computed(() => {
    return dispatchesStore.getData()
})

dispatchesStore.fetch()
</script>

<template>
    <Table
        :elements="data"
        :config="configuration"
        :columns="columns">
        <template #start-buttons>
            <ActionButtons :items="buttons" />
        </template>
    </Table>
</template>
