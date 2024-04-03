<script setup>
import { inject, onMounted, ref, computed } from 'vue'
import { configColumns } from './configColumns'
import { configTable } from './configTable'
import { configButtons } from './configButtons'
import { Table } from 'table'
import { ActionButtons } from 'layout'
import SlideOverActions from '../../components/slideOverActions/SlideOverActions.vue'
import { useSlideOver as useSlideComposable } from '../../components/slideOverActions/useSlideOver'

// SlideOver

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const vendorsStore = useGlobalStore('vendors')
const rapidStore = useGlobalStore('rapidStore')

const apiGrid = ref()
const selectedRows = ref([])

const useSlideOver = useSlideComposable()

rapidStore.$registerGlobalEvent('vendorsAfterSuccess', payload => {
    selectedRows.value = []
})

const thread = ref({
    idThread: router.currentRoute.value?.query?.idThread,
    action: router.currentRoute.value?.query?.action
})

const buttons = configButtons({ useGlobalStore, apiGrid, useSlideOver, selectedRows, thread })

const data = computed(() => {
    return vendorsStore.data
})

const columns = configColumns({ apiGrid, selectedRows })
const configuration = configTable({ apiGrid, selectedRows })

onMounted(() => {
    vendorsStore.fetch()
})
</script>

<template>
    <Table
        :elements="data"
        :columns="columns"
        :config="configuration">
        <template v-slot:start-buttons>
            <ActionButtons
                :items="buttons" />
        </template>
    </Table>

    <SlideOverActions
        :useSlideOver="useSlideOver" />
</template>
