<script setup>
import { inject, onMounted, ref, computed, watch, onUnmounted } from 'vue'
import { configColumns } from './configColumns'
import { configTable } from './configTable'
import { configButtons } from './configButtons'
import { Table } from 'table'
import { ActionButtons, Overlay } from 'layout'

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const processStore = useGlobalStore('process')

const apiGrid = ref()
const selectedRows = ref([])
const thread = ref({
    idThread: router.currentRoute.value?.query?.idThread,
    action: router.currentRoute.value?.query?.action
})

const isLoading = ref(true)

const buttons = configButtons({ useGlobalStore, apiGrid, selectedRows, thread, isLoading })

const data = computed(() => {
    return processStore.data
})

const columns = configColumns({ apiGrid, selectedRows })
const configuration = configTable({ apiGrid, selectedRows })

const unwatch = watch(() => processStore.fetching, (nValue, oValue) => {
    apiGrid.value?.deselectAll()
})

onMounted(async () => {
    await processStore.fetch()

    isLoading.value = false
})

onUnmounted(() => {
    unwatch()
})
</script>

<template>
    <Overlay
        v-if="isLoading"
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
</template>
