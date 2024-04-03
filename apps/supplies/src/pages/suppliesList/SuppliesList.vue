<script setup>
import { inject, onMounted, ref, computed } from 'vue'
import { configColumns } from './configColumns'
import { configTable } from './configTable'
import { configButtons } from './configButtons'
import { Table } from 'table'
import { ActionButtons, Overlay } from 'layout'
import { useSlideOver as useSlideComposable } from './useSlideOver'
import SlideOverActions from './SlideOverActions.vue'

const useGlobalStore = inject('useGlobalStore')
const router = inject('router')

const suppliesStore = useGlobalStore('supplies')
const useSlideOver = useSlideComposable()

const apiGrid = ref()
const selectedRows = ref([])
const isLoading = ref(true)

const thread = ref({
    idThread: router.currentRoute.value?.query?.idThread,
    action: router.currentRoute.value?.query?.action
})

const buttons = configButtons({ useGlobalStore, apiGrid, selectedRows, thread, useSlideOver, isLoading })

const data = computed(() => {
    return suppliesStore.data
})

const columns = configColumns({ apiGrid, selectedRows })
const configuration = configTable({ apiGrid, selectedRows })

onMounted(async () => {
    await suppliesStore.fetch()

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
            <ActionButtons
                :items="buttons" />
        </template>
    </Table>

    <SlideOverActions
        :use-slide-over="useSlideOver" />
</template>
