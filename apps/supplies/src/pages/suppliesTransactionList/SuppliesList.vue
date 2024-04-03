<script setup>
import { inject, onMounted, ref, computed, nextTick } from 'vue'
import { configColumns } from './configColumns'
import { configButtons } from './configButtons'
import { configTable } from './configTable'
import { Table } from 'table'
import { ActionButtons, Overlay } from 'layout'
import { useSlideOver as useSlideComposable } from './useSlideOver'
import SlideOverActions from './SlideOverActions.vue'
import { round, uuid } from 'shared'
import { useI18n } from 'vue-i18n'
import { useSupplyList as useSupplyListComposable } from './useSupplyList'
import SuppliesTransactionsReportPDF from './SuppliesTransactionsReportPDF.vue'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const suppliesTransactionStore = useGlobalStore('suppliesTransaction')
const parameterStore = useGlobalStore('parameters')
const useSlideOver = useSlideComposable()

const apiGrid = ref()
const selectedRows = ref([])

const parentExists = (data, id) => {
    const exists = data.find(x => x.id === id)
    return !!exists
}

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
        type: totalQuantity > 0 ? 'IN' : totalQuantity < 0 ? 'OUT' : '',
        inQuantity: totalQuantity > 0 && children.length === 1 ? round(totalQuantity) : null,
        outQuantity: totalQuantity < 0 && children.length === 1 ? round(-1 * totalQuantity) : null,
        name: lastChild.name,
        measure: lastChild.measure,
        unit_cost: children.length === 1 ? lastChild.cost || null : null,
        cost: children.length === 1 ? `${round(lastChild.quantity * lastChild.cost)}` || null : null,
        updated_at: lastChild.updated_at,
        location: lastChild.location,
        category: lastChild.category,
        supply_order_id: children.length === 1 ? lastChild.supply_order_id : null
    }
}

const formatItem = (item, parentPath) => {
    const newUuid = uuid()

    const newItem = {
        id: null,
        path: [...parentPath, `${item.name} - ${newUuid}`],
        originalQuantity: round(item.quantity),
        quantity: round(item.quantity),
        inQuantity: item.quantity >= 0 ? round(item.quantity) : null,
        outQuantity: item.quantity < 0 ? round(-1 * item.quantity) : null,
        type: item.quantity >= 0 ? 'IN' : 'OUT',
        name: item.name,
        measure: item.measure,
        unit_cost: `${round(item.cost)}`,
        cost: item.quantity >= 0 ? `${round(item.quantity * item.cost)}` : `${round(-1 * (item.quantity * item.cost))}`,
        updated_at: item.updated_at,
        location: item.location,
        category: item.category,
        supply_order_id: item.supply_order_id
    }

    return newItem
}

const totalRow = computed(() => {
    const data = suppliesTransactionStore.data

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

    totalRow.cost = `$${round(totalRow.cost)}`

    return [totalRow]
})

const data = computed(() => {
    const parameters = parameterStore.data

    const data = suppliesTransactionStore.data

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

const columns = configColumns({ apiGrid, selectedRows, useGlobalStore })
const configuration = ref(null)

const isLoading = ref(true)

const useSupplyList = useSupplyListComposable()

onMounted(async () => {
    await suppliesTransactionStore.fetch()

    isLoading.value = false

    nextTick(() => {
        configuration.value = configTable({ apiGrid, selectedRows, totalRow, t })
    })
})

const dataAfterFilter = ref([])
const displayedColumns = ref([])

const getDataAfterFilter = () =>{
    dataAfterFilter.value = configuration.value.getFilteredData()

    displayedColumns.value = configuration.value.getDisplayedColumns()
}

const buttons = configButtons({ useGlobalStore, apiGrid, selectedRows, isLoading, useSupplyList, getDataAfterFilter })
</script>

<template>
    <!-- Supplies transactions Report -->
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
        <SuppliesTransactionsReportPDF
            :data="dataAfterFilter"
            :displayedColumns="displayedColumns"
            :totalRow="totalRow" />
    </div>
</template>
