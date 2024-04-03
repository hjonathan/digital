<script setup>
import { inject, onMounted, ref, computed } from 'vue'
import { configColumns } from './configColumns'
import { configTable } from './configTable'
import { configButtons } from './configButtons'
import { Table } from 'table'
import { ActionButtons, Overlay } from 'layout'

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const salesOrderStore = useGlobalStore('salesOrder')

const apiGrid = ref()
const selectedRows = ref([])

const thread = ref({
    idThread: router.currentRoute.value?.query?.idThread,
    action: router.currentRoute.value?.query?.action
})

const buttons = configButtons({ useGlobalStore, apiGrid, selectedRows, thread })

const data = computed(() => {
    return salesOrderStore.getData()
})

const columns = configColumns({ apiGrid, selectedRows })
const configuration = configTable({ apiGrid, selectedRows })

const isLoading = ref(true)

onMounted(async () => {
    await salesOrderStore.fetch()

    isLoading.value = false
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
            <ActionButtons :items="buttons" />
        </template>
    </Table>
</template>
