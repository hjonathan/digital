<script setup>
import { computed, ref } from 'vue'
import { TableUI, Title } from 'layout'
import { formatDate, showUuid } from 'shared'
import { InputLabel } from 'form'

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
        field: 'id',
        name: 'ID',
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'name',
        name: 'Name',
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'price',
        name: 'Price',
        customClass: '!w-1/12'
    },
    {
        field: 'quantity',
        name: 'Quantity',
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'measure',
        name: 'Measure',
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'sku',
        name: 'SKU',
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'category',
        name: 'Category',
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'location',
        name: 'Location',
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'description',
        name: 'Description',
        align: 'left',
        customClass: '!w-1/12'
    },
    {
        field: 'cost',
        name: 'Total cost',
        customClass: '!w-1/12'
    },
    {
        field: 'updated_at',
        name: 'Updated at',
        customClass: '!w-1/12'
    },
])

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
        id="unknownSupplyListPrintableArea">
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
            :title="$t('Unknown supplies list')"
            :has-border-bottom-line="false"
            class="text-2xl font-semibold flex justify-center !pt-0 mb-4" />

        <TableUI
            :columns="activeColumns()"
            :data="data"
            class="print-use-all-columns">
            <template v-slot:row="{ row }">
                <tr :class="{ 'bg-gray-200 font-semibold' : row.id === 'grand_total' }">
                    <!-- ID -->
                    <td 
                        v-show="showTableData('id')"
                        class="whitespace-nowrap">
                        {{ showUuid(row.id)  }}  
                    </td>
                    
                    <!-- Name -->
                    <td v-show="showTableData('name')">
                        {{ row.name }}  
                    </td>

                    <!-- Price -->
                    <td
                        v-show="showTableData('price')"
                        class="text-end pr-4">
                        ${{ row.price ? row.price : 0 }}
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

                    <!-- SKU -->
                    <td 
                        v-show="showTableData('sku')">
                        {{ row?.sku }}
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

                    <!-- Description -->
                    <td 
                        v-show="showTableData('description')"
                        class="whitespace-nowrap">
                        {{ row?.description }}
                    </td>

                    <!-- Updated at -->
                    <td 
                        v-show="showTableData('updated_at')"
                        class="text-end pr-4 whitespace-nowrap">
                        {{ row.updated_at ? formatDate(row.updated_at, 'fullFormat') : '-' }}
                    </td>
                </tr>
            </template>
        </TableUI>  
    </section>
</template>