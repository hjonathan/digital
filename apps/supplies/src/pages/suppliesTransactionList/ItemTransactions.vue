<script setup>
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { TableUI, Title, Icon, Button } from 'layout'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { configButtonsItemReport } from './configButtons'
import { InputLabel, DatePicker, Treeselect } from 'form'
import * as echarts from 'echarts'
import { formatAmericanDate, formatDate, round, showUuid } from 'shared'
import { mdiArrowDownThin, mdiArrowUpThin } from '@mdi/js'
import moment from 'moment'
import { useSupplyTransactionReport as useSupplyTransactionReportComposable } from './useSupplyTransactionReport'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = inject('router')

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const suppliesStore = useGlobalStore('supplies')
const processStore = useGlobalStore('process')
const suppliesTransactionStore = useGlobalStore('suppliesTransaction')
const parameterStore = useGlobalStore('parameters')

const useSupplyTransactionReport = useSupplyTransactionReportComposable()

const chart = ref(null)
const filters = ref({})
const chartResizer = ref(null)

const columns = ref([
    {
        field: 'transaction_id',
        name: t('Transaction ID'),
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'unit_cost',
        name: t('Unit cost'),
        customClass: '!w-1/12'
    },
    {
        field: 'total_cost',
        name: t('Total cost'),
        customClass: '!w-1/12'
    },
    {
        field: 'in',
        name: t('In'),
        customClass: '!w-1/12'
    },
    {
        field: 'out',
        name: t('Out'),
        customClass: '!w-1/12'
    },
    {
        field: 'department',
        name: t('Department'),
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'updated_at',
        name: t('Updated at'),
        align: 'left',
        customClass: '!w-1/12'
    },
])

const itemData = ref({
    name: '',
    measure: {},
    category: {},
    location: {}
})

const openTabDocument = async (transaction) => {
    const response = await processStore.fetchSupplyOrderById(transaction.supply_order_id)

    const tabName = transaction.quantity >= 0 ? 'SuppliesShowInvoice' : 'ShowDispatchNote'

    tabsStore.openTab({ name: tabName, params: { id: transaction.supply_order_id } })
}

suppliesTransactionStore.fetch()

const getTotal = (items, date) => {
    let total = 0

    for (const item of items) {
        if (formatDate(item.updated_at) <= date) {
            total += item.quantity
        }
    }

    return round(total)
}

const getTotalIn = (items, date) => {
    let total = 0

    for (const item of items) {
        if (formatDate(item.updated_at) === date && item.quantity >= 0) {
            total += item.quantity
        }
    }

    return round(total)
}

const getTotalOut = (items, date) => {
    let total = 0

    for (const item of items) {
        if (formatDate(item.updated_at) === date && item.quantity < 0) {
            total += (item.quantity * -1)
        }
    }

    return round(total)
}

const getTransactions = computed(() => {
    const finalData = suppliesTransactionStore.getData()
        .filter(transaction => transaction.id === router.currentRoute.value.params.id)

    return finalData
})

const allData = computed(() => {
    let totalCost = 0
    let totalIn = 0
    let totalOut = 0

    const parameters = parameterStore.data

    let dataTransactions = getTransactions.value

    if (filters.value.date) {
        const [dateOne, dateTwo] = filters.value.date

        const startDate = dateOne ? formatDate(dateOne) : null
        const endDate = dateTwo ? formatDate(dateTwo) : null

        if (startDate && endDate) {
            dataTransactions = getTransactions.value.filter(transaction => formatDate(transaction.updated_at) >= startDate && formatDate(transaction.updated_at) <= endDate)
        }
    }

    if (filters.value.area) {
        dataTransactions = getTransactions.value.filter(transaction => {
            return transaction.area_id.toString() === filters.value.area.toString()
        })
    }

    const finalData = dataTransactions
        .map(transaction => {
            if (transaction.quantity >= 0) {
                transaction.in = transaction.quantity

                totalIn += transaction.quantity
            }

            if (transaction.quantity < 0) {
                transaction.out = transaction.quantity * -1

                totalOut += (transaction.quantity * -1)
            }

            transaction.location = parameters.find(location => location.id.toString() === transaction.measure_id.toString())
            transaction.measure = parameters.find(measure => measure.id.toString() === transaction.measure_id.toString())
            transaction.category = parameters.find(category => category.id.toString() === transaction.category_id.toString())

            transaction.unit_cost = round(transaction.cost)
            transaction.total_cost = round(transaction.cost * (transaction.quantity >= 0 ? transaction.quantity : -1 * transaction.quantity))

            totalCost += round(transaction.cost * transaction.quantity)

            return transaction
        })

    const chartData = {
        labels: new Set(),
        values: {
            total: [],
            in: [],
            out: []
        }
    }

    for (let index = 0; index < finalData.length; index++) {
        const transaction = finalData[index]

        chartData.labels.add(formatDate(transaction.updated_at))
    }

    for (const date of chartData.labels) {
        chartData.values.in.push(getTotalIn(finalData, date))
        chartData.values.out.push(getTotalOut(finalData, date))
        chartData.values.total.push(getTotal(finalData, date))
    }

    const inElements = finalData.filter(transaction => transaction.quantity >= 0)

    const lastInElement = inElements[inElements.length - 1] || { unit_cost: 0 }

    const lastElement = finalData.length ? finalData[finalData.length - 1] : {}

    return {
        totalCost: round(totalCost),
        totalIn: round(totalIn),
        totalOut: round(totalOut),
        finalData,
        lastCost: `$${lastInElement.unit_cost}` || '$0',
        updatedAt: lastElement.updated_at ? formatAmericanDate(lastElement.updated_at) : '',
        series: [
            {
                name: t('Available quantity'),
                type: 'line',
                stack: 'Available quantity',
                label: {
                    show: false,
                    position: 'bottom'
                },
                data: chartData.values.total,
                itemStyle: { color: '#283593' },
                lineStyle: { color: '#283593' }
            },
            {
                name: t('In'),
                type: 'line',
                stack: 'In',
                label: {
                    show: false,
                    position: 'bottom'
                },
                data: chartData.values.in,
                itemStyle: { color: '#16a349' },
                lineStyle: { color: '#16a349' }
            },
            {
                name: t('Out'),
                type: 'line',
                stack: 'Out',
                label: {
                    show: false,
                    position: 'bottom'
                },
                data: chartData.values.out,
                itemStyle: { color: '#dc2725' },
                lineStyle: { color: '#dc2725' }
            },
        ],
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: Array.from(chartData.labels)
        }
    }
})

const unwatch = watch(() => allData.value, (nValue) => {
    nextTick(() => {
        const chartDom = document.getElementById('chart')

        chart.value = echarts.init(chartDom, null, {
            renderer: 'svg',
            useDirtyRect: true
        })

        const options = {
            tooltip: {
                triggerOn: 'none',
                formatter: function (params) {
                    return params
                }
            },
            legend: {
                data: [t('Available quantity'), t('In'), t('Out')]
            },
            grid: {
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: nValue.xAxis,
            yAxis: {
                type: 'value'
            },
            series: nValue.series
        }

        chart.value && chart.value.setOption(options)

        !chartResizer.value && (chartResizer.value = new ResizeObserver(() => chart.value.resize()).observe(chartDom))
    })
})

const areas = computed(() => {
    const areas = parameterStore.getAutocompleteDataBySlug('areas').map(x => ({ ...x, key: x.id }))

    return areas
})

const getAreaName = (transaction) => {
    const area = parameterStore.data?.find(area => area.id === transaction.area_id)

    return area?.name
}

const getAreaNameByID = (id) => {
    const area = parameterStore.data?.find(area => area.id === Number(id))

    return area?.name
}

onMounted(async () => {
    const currentQuarter = moment().quarter()

    filters.value.date = [moment(moment().startOf('year')).quarter(currentQuarter).toDate(), moment().toDate()]

    await suppliesStore.fetch()

    itemData.value = suppliesStore.getData().find(item => item.id === router.currentRoute.value.params.id)

    itemData.value.formatedId = showUuid(itemData.value.id)
})

const isDataLoading = computed(() => {
    return !allData.value.finalData.length
})

const buttons = configButtonsItemReport({ useSupplyTransactionReport, isDataLoading })
</script>

<template>
    <!-- Supply transaction report -->
    <DocumentWrapper
        :buttons="buttons">
        <section 
            id="supplyTransactionReportPrintableArea"
            class="paper text-base">
            <Title
                :title="$t('Supply transaction report')"
                :has-border-bottom-line="false"
                class="flex justify-center text-2xl font-semibold !pt-0" />

            <Title
                :title="`${itemData.name} ${$t('transactions')}`"
                :has-border-bottom-line="false" 
                title-type="h2"
                class="font-semibold" />

            <div class="row cols-2 mb-2">
                <div class="gutter-xs">
                    <InputLabel
                        v-model="itemData.formatedId"
                        :label="$t('ID')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="itemData.name"
                        :label="$t('Name')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="itemData.category.name"
                        :label="$t('Category')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="itemData.quantity"
                        :label="$t('Available quantity')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="itemData.measure.name"
                        :label="$t('Unit of measure')"
                        mode="readonly"
                        outline
                        dense />
                </div>

                <div class="gutter-xs">
                    <InputLabel
                        v-model="allData.lastCost"
                        :label="$t('Last price')"
                        mode="readonly"
                        outline
                        dense />

                    <InputLabel
                        v-model="allData.updatedAt"
                        :label="$t('Updated at')"
                        mode="readonly"
                        outline
                        dense />
                </div>
            </div>

            <Title
                :title="$t('Item transactions')"
                :has-border-bottom-line="false"
                title-type="h2"
                class="font-semibold" />

            <div class="notPrintableArea">
                <!-- Department and Datepicker -->
                <div class="row cols-3">
                    <DatePicker
                        v-model="filters.date"
                        :placeholder="$t('Range date')"
                        size="sm"
                        outline
                        container-class="none"
                        :minDate="null"
                        selection-mode="range" />

                    <Treeselect
                        v-model="filters.area"
                        :placeholder="$t('Department')"
                        :options="areas"
                        :forceSelection="false"
                        :errors="errors?.request_area_id ? errors.request_area_id[0] : null"
                        container-class="none"
                        outline
                        size="sm" />
                </div>
            </div>

            <!-- For print view -->
            <div class="hideInView mb-3">
                <p>
                    <span class="font-semibold">
                        {{ $t('From:') }}
                    </span>
                    
                    {{ filters?.date?.length ? formatDate(filters.date[0]) : '-' }} 
                    
                    <span class="font-semibold">
                        {{ $t('To:') }}
                    </span>

                    {{ filters?.date?.length ? formatDate(filters.date[1]) : '-' }}
                </p>

                <span class="font-semibold">
                    {{ $t('Department:') }} 
                </span>

                {{ filters.area ? getAreaNameByID(filters.area) : `- ${$t('No department selected')} -` }}
            </div>
            
            <!-- Table -->
            <div class="row overflow-auto mb-2">
                <TableUI
                    :columns="columns"
                    :data="allData.finalData"
                    class="print-use-all-columns">
                    <template v-slot:row="{ row }">
                        <tr>
                            <td>
                                {{ showUuid(row.supply_order_id) }}
                            </td>

                            <td class="text-end">
                                ${{ row.unit_cost }}
                            </td>

                            <td class="text-end">
                                ${{ row.total_cost }}
                            </td>

                            <td class="text-end pr-4">
                                <button
                                    v-if="row.in"
                                    @click="openTabDocument(row)"
                                    class="underline print-no-underline text-green-600 print-text-black">
                                    <Icon
                                        :icon="mdiArrowUpThin"
                                        size="xs"/>
                                        {{ row.in  }} {{ row.measure?.name }}
                                </button>
                            </td>

                            <td class="text-end pr-4">
                                <button
                                    v-if="row.out"
                                    @click="openTabDocument(row)"
                                    class="underline print-no-underline text-red-600 print-text-black">
                                    <Icon
                                        :icon="mdiArrowDownThin"
                                        size="xs"/>
                                        {{ row.out  }} {{ row.measure?.name }}
                                </button>
                            </td>

                            <td>
                                {{ getAreaName(row) }}
                            </td>

                            <td>
                                {{ formatAmericanDate(row.user_updated) }}
                            </td>
                        </tr>
                    </template>

                    <template v-slot:total>
                        <tr class="bg-gray-100">
                            <td>
                                <span class="font-bold">{{ $t('Grand total') }}</span>
                            </td>
                            
                            <td />
                            
                            <td class="text-end">
                                ${{ allData.totalCost }}
                            </td>
                            
                            <td class="text-end text-green-600 print-text-black pr-4">
                                {{ allData.totalIn }} {{ allData.finalData[0]?.measure?.name }}
                            </td>
                            
                            <td class="text-end text-red-600 print-text-black pr-4">
                                {{ allData.totalOut }} {{ allData.finalData[0]?.measure?.name }}
                            </td>
                            
                            <td colspan="2" />
                        </tr>
                    </template>
                </TableUI>
            </div>

            <Title
                :title="$t('Item movements')"
                title-type="h2"
                :has-border-bottom-line="false"
                class="font-semibold" />

            <div
                v-if="!allData.finalData.length"
                class="flex flex-row justify-center">
                {{ $t('No data found') }}
            </div>

            <!-- Chart -->
            <div
                v-show="allData.finalData.length"
                id="chart" 
                class="h-96" />

            <Button
                v-if="false"
                :label="$t('Print chart as base64')"
                @click="chartToBase64" />
        </section>
    </DocumentWrapper>
</template>

<style>
.hideInView {
    display: none
}
</style>
