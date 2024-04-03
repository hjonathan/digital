<script setup>
import { inject, ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { configColumns } from './configColumns'
import { configTable } from './configTable'
import { configButtons } from './configButtons'
import { Table } from 'table'
import { tableStartupVars } from 'shared'
import { ActionButtons } from 'layout'
import SlideOverActions from '@/../../inventory/src/pages/slideOverActions/SlideOverActions.vue'

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const key = tableStartupVars(inject)

const apiGrid = ref()
const id = router.currentRoute.value.query?.id && Array.isArray(router.currentRoute.value.query?.id) ? router.currentRoute.value.query?.id[0] : router.currentRoute.value.query?.id

const labResultsStore = useGlobalStore('labResults')

const data = computed(() => {
    return labResultsStore.getTreeData()
})

const onFirstDataRendered = ({ api }) => {
    const nodesToSelect = []

    if (id) {
        api.forEachNode((node) => {
            node.data.id === id && nodesToSelect.push(node)
        })

        api.setNodesSelected({ nodes: nodesToSelect, newValue: true })
    }
}

const columns = configColumns({ useGlobalStore, key, apiGrid })
const configuration = configTable({ useGlobalStore, key, apiGrid, onFirstDataRendered })
const buttons = configButtons({ useGlobalStore, key, apiGrid })

const unwatch = watch(() => labResultsStore.fetching, () => {
    if (apiGrid.value) {
        labResultsStore.fetching && apiGrid.value.showLoadingOverlay()

        !labResultsStore.fetching && apiGrid.value.hideOverlay()

        apiGrid.value.deselectAll()
    }
}, { deep: true })

onMounted(async () => {
    await labResultsStore.fetch()

    onFirstDataRendered({ api: apiGrid.value })
})

onUnmounted(() => {
    unwatch()
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
