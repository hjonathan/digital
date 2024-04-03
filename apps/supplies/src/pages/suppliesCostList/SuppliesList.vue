<script setup>
import { inject, onMounted, ref, computed, nextTick } from 'vue'
import { configButtons } from './configButtons'
import { configColumns } from './configColumns'
import { configTable } from './configTable'
import { Table } from 'table'
import { useSlideOver as useSlideComposable } from './useSlideOver'
import SlideOverActions from './SlideOverActions.vue'
import { round, uuid } from 'shared'
import { useI18n } from 'vue-i18n'
import { ActionButtons, Overlay } from 'layout'
import SupplyCostReportPDF from './SupplyCostReportPDF.vue'
import { useSuppliesCostList as useSuppliesCostListComposable } from './useSuppliesCostList'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const suppliesCostStore = useGlobalStore('suppliesCost')
const parameterStore = useGlobalStore('parameters')
const useSlideOver = useSlideComposable()

const apiGrid = ref()
const selectedRows = ref([])

const isLoading = ref(true)

const parentExists = (data, id) => {
    const exists = data.find(x => x.id === id)
    
    return !!exists
}

const useSuppliesCostList = useSuppliesCostListComposable()

const getParent = (data, id) => {
    const children = data.filter(item => item.id === id)

    const lastChild = children[children.length - 1]

    let totalQuantity = 0

    for (const child of children) {
        totalQuantity += child.quantity
    }

    return {
        id,
        path: [lastChild.name],
        quantity: round(totalQuantity),
        name: lastChild.name,
        measure: lastChild.measure,
        unit_cost: children.length === 1 ? round(lastChild.cost) || null : null,
        cost: children.length === 1 ? `${round(lastChild.quantity * lastChild.cost)}` || null : null,
        updated_at: lastChild.updated_at,
        location: lastChild.location,
        category: lastChild.category,
        supply_order_id: children.length === 1 ? lastChild.supply_order_id : null
    }
}

const formatItem = (item, parentPath) => {
    const newUuid = uuid()

    return {
        id: null,
        path: [...parentPath, `${item.name} - ${newUuid}`],
        quantity: round(item.quantity),
        name: item.name,
        measure: item.measure,
        unit_cost: `${item.cost}`,
        cost: `${round(item.quantity * item.cost)}` || null,
        updated_at: item.updated_at,
        location: item.location,
        category: item.category,
        supply_order_id: item.supply_order_id
    }
}

const totalRow = computed(() => {
    const data = suppliesCostStore.data

    const totalRow = {
        id: 'grand_total',
        path: [],
        quantity: null,
        name: t('Grand total'),
        measure: null,
        unit_cost: null,
        cost: 0,
        updated_at: null,
        location: null,
        category: null,
        supply_order_id: null
    }

    for (const item of data) {
        totalRow.cost += (item.cost * item.quantity)
    }

    totalRow.cost = `${round(totalRow.cost)}`

    return [totalRow]
})

const data = computed(() => {
    const parameters = parameterStore.data

    const data = suppliesCostStore.data.filter(x => x.quantity >= 0)

    for (const item of data) {
        item.location = parameters.find(location => location.id.toString() === item.location_id.toString())
        item.measure = parameters.find(measure => measure.id.toString() === item.measure_id.toString())
        item.category = parameters.find(category => category.id.toString() === item.category_id.toString())
    }

    const groups = new Set([...data.map(item => item.id)])

    const newData = []

    let currentParent = null

    for (const group of groups) {
        if (!parentExists(newData, group)) {
            currentParent = getParent(data, group)

            newData.push(currentParent)
        }

        const children = data.filter(x => x.id === group)

        if (children.length > 1) {
            for (const item of children) {
                newData.push(formatItem(item, currentParent?.path || []))
            }
        }
    }

    return newData
})

const configuration = ref(null)

const apiColumns = ref(null)

onMounted(async () => {
    await suppliesCostStore.fetch()

    isLoading.value = false

    nextTick(() => {
        configuration.value = configTable({ apiGrid, selectedRows, totalRow, apiColumns, t })
    })
})

const dataAfterFilter = ref([])
const displayedColumns = ref([])

const getDataAfterFilter = () =>{
    dataAfterFilter.value = configuration.value.getFilteredData()

    displayedColumns.value = configuration.value.getDisplayedColumns()
}

const columns = configColumns({ apiGrid, selectedRows, useGlobalStore })

const buttons = configButtons({ useGlobalStore, apiGrid, selectedRows, isLoading, useSuppliesCostList, getDataAfterFilter })
</script>

<template>
    <!-- Supplies Cost Report -->
    <Overlay
        v-if="isLoading"
        class="z-50" />

    <Table
        v-if="!isLoading && configuration"
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

    <!-- PDF section -->
    <div class="hidden">
        <SupplyCostReportPDF
            :data="dataAfterFilter"
            :displayedColumns="displayedColumns"
            :totalRow="totalRow" />
    </div>
</template>
