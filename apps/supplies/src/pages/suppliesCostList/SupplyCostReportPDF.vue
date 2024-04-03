<script setup>
import { computed, ref } from 'vue'
import { TableUI, Title } from 'layout'
import { formatDate } from 'shared'
import { InputLabel } from 'form'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    data: Object,
    displayedColumns: {
        type: Object,
        default: [{}]
    },
    totalRow: Object
})

const allColumns = ref([
    {
        field: 'name',
        name: t('Name'),
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'quantity',
        name: t('Quantity'),
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'measure',
        name: t('Measure'),
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'unit_cost',
        name: t('Unit cost'),
        customClass: '!w-1/12'
    },
    {
        field: 'cost',
        name: t('Total cost'),
        customClass: '!w-1/12'
    },
    {
        field: 'updated_at',
        name: t('Updated at'),
        customClass: '!w-1/12'
    },
    {
        field: 'category',
        name: t('Category'),
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'location',
        name: t('Location'),
        align: 'left',
        customClass: '!w-1/12'
    },
])

const allData = computed(() => {
    return [... props.data, props.totalRow[0]]
})

const displayedColumnsArray = computed(() => {
    return props.displayedColumns.map(column => {
        return column.colId === 'ag-Grid-AutoColumn' ? 'name' : column.colId
    })
})

const activeColumns = () => {
    return allColumns.value.filter(col => {
        return displayedColumnsArray.value.includes(col.field)
    })
}

const showTableData = (name) => {
    return displayedColumnsArray.value.includes(name)
}

const currentDate = formatDate(new Date()) 
</script>

<template>
    <section
        id="suppliesCostPrintableArea">
        <!-- Current date -->
        <div class="grid grid-cols-10">
            <div class="col-start-8 col-span-3 mb-2">
                <InputLabel
                    v-model="currentDate"
                    :label="$t('Date')"
                    mode="readonly"
                    outline
                    dense />
            </div>
        </div>

        <Title 
            :title="$t('Supplies Cost')"
            :has-border-bottom-line="false"
            class="text-2xl font-semibold flex justify-center !pt-0 mb-4" />

        <TableUI
            :columns="activeColumns()"
            :data="allData"
            class="print-use-all-columns">
            <template v-slot:row="{ row }">
                <tr :class="{ 'bg-gray-200 font-semibold' : row.id === 'grand_total' }">
                    <!-- Name -->
                    <td>
                        <span :class="{ 'pl-6' : row.path.length > 1 }">
                            {{ row.name }}  
                        </span>
                    </td>

                    <!-- Quantity -->
                    <td 
                        v-show="showTableData('quantity')"
                        class="text-end pr-4">
                        {{ row.quantity }}
                    </td>

                    <!-- Measure -->
                    <td 
                        v-show="showTableData('measure')">
                        {{ row.measure?.name }}
                    </td>

                    <!-- Unit cost -->
                    <td
                        v-show="showTableData('unit_cost')"
                        class="text-end pr-4">
                        ${{ row.unit_cost ? row.unit_cost : 0 }}
                    </td>

                    <!-- Total cost -->
                    <td 
                        v-show="showTableData('cost')"
                        class="text-end pr-4">
                        ${{ row.cost ? row.cost : 0 }}
                    </td>

                    <!-- Updated at -->
                    <td 
                        v-show="showTableData('updated_at')"
                        class="text-end pr-4 whitespace-nowrap">
                        {{ row.updated_at ? formatDate(row.updated_at, 'fullFormat') : '-' }}
                    </td>

                    <!-- Category -->
                    <td 
                        v-show="showTableData('category')"
                        class="whitespace-nowrap">
                        {{ row?.category?.name }}
                    </td>

                    <!-- Location -->
                    <td 
                        v-show="showTableData('location')"
                        class="whitespace-nowrap">
                        {{ row?.location?.name }}
                    </td>
                </tr>
            </template>
        </TableUI>  
    </section>
</template>