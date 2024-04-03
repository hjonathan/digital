<script setup>
import { Input } from 'form'
import { TableUI, Button } from 'layout'
import { onMounted, ref, inject } from 'vue'
import { mdiArrowDown, mdiArrowUp } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { showUuid } from 'shared'
import { get, isFunction } from 'lodash'

const { t } = useI18n()

const props = defineProps({
    params: Object
})

const useGlobalStore = inject('useGlobalStore')
const parametersStore = useGlobalStore('parameters')

const data = ref(props.params.data)

const fields = ref([
    {
        name: t('ID'),
        field: (row) => {
            return showUuid(row.supply_id)
        }
    },
    {
        name: t('Quantity'),
        field: 'quantity'
    },
    {
        name: t('Category'),
        field: (row) => {
            return parametersStore.getItemById(row.category_id).name
        }
    },
    {
        name: t('Name'),
        field: 'name'
    },
    {
        name: t('Units of measure'),
        field: (row) => {
            return parametersStore.getItemById(row.measure_id).name
        }
    },
    {
        name: t('Location'),
        field: (row) => {
            return parametersStore.getItemById(row.location_id).name
        }
    },
    {
        name: t('SKU'),
        field: 'sku'
    },
])
</script>
<template>
    <div class="pl-[18%] py-4 pr-4">
        <template v-for="(row, rowIndex) in data.supply" :key="rowIndex">
            <div :class="['detail-receipt grid grid-cols-3 gap-2 !pt-4 !pb-4 !pl-4 !pr-4', {'bg-gray-100':rowIndex%2 == 1}]">
                <template v-for="(field, fieldIndex) in fields" :key="fieldIndex">
                    <div :class="['flex text-gray-600']">
                        <span class="font-bold text-start !w-36">{{ field.name }} </span>
                        <span >{{ isFunction(field.field)? field.field(row) : get(row,field.field) }} </span>
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
<style>
.detail-receipt.grid{
    padding: 1rem !important;
}
</style>
