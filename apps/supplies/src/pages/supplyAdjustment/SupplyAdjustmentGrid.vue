<script setup>
import { inject, computed, ref } from 'vue'
import { Button, TableUI, Icon } from 'layout'
import { Input, ToggleSwitch } from 'form'
import { mdiTrashCanOutline, mdiPlus, mdiArrowULeftBottom, mdiArrowUpThin, mdiArrowDownThin } from '@mdi/js'
import { defineModel, showUuid } from 'shared'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const SUPPLY_ACTIONS = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete' 
}

const props = defineProps({
    useSupplyAdjustment: Object,
    data: Array,
    mode: {
        type: String,
        default: 'edit'
    }, // view, edit
    errors: {
        type: Object,
        default: () => { return {} }
    },
    schema: Object
})

const useGlobalStore = inject('useGlobalStore')
const parametersStore = useGlobalStore('parameters')
const tabsStore = useGlobalStore('tabs')

const { data } = props.useSupplyAdjustment

const errorsModel = defineModel('errors')
const errorsId = 'adjust_supplies'
const dataTable = defineModel('data')

const gridErrors = ref({})

const columns = computed(() => {
    const columns = [

        {
            field: 'invoice.number',
            name: t('Quantity'),
            align: 'left',
            customClass: '!w-2/12'
        },
        {
            field: 'invoice.number',
            name: t('Cost'),
            align: 'left',
            customClass: '!w-2/12'
        },
        {
            field: 'invoice.number',
            name: t('Unit of measure'),
            align: 'left',
            customClass: '!w-2/12 whitespace-nowrap'
        },
        {
            field: 'invoice.number',
            name: t('Location'),
            align: 'left',
            customClass: '!w-2/12 whitespace-nowrap'
        },
    ]

    if (props.mode === 'edit') {
        columns.unshift({
            field: 'invoice.number',
            name: t('Invoice number'),
            align: 'left',
            customClass: '!w-2/12'
        })

        columns.unshift({
            field: '',
            name: '',
            align: 'left',
            customClass: '!w-1/12'
        })

        columns.push({
            field: 'invoice.number',
            name: '',
            align: 'right',
            customClass: '!w-1/12'
        })
    }

    return columns
})

const measures = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('measures')
})

const locations = computed(() => {
    return parametersStore.data
})

const getMeasureName = (measureId) => {
    return measures.value.find(measure => measure.id === measureId)?.label
}

const getLocationName = (locationId) => {
    return locations.value.find(location => location.id === locationId)?.name
}

const onRemove = (item, index) => {
    if (dataTable.value[index]?.id) {
        dataTable.value[index].supply_action = dataTable.value[index].supply_action === SUPPLY_ACTIONS.DELETE ? '' : SUPPLY_ACTIONS.DELETE

        dataTable.value[index].quantity = dataTable.value[index].original_quantity
        dataTable.value[index].cost = dataTable.value[index].original_cost

        dataTable.value[index].modified = false

        return
    }

    dataTable.value.splice(index, 1)
}

const onAdd = () => {
    dataTable.value.push({
        supply_action: SUPPLY_ACTIONS.CREATE,
        cost: 0,
        quantity: 0,
        original_cost: 0,
        original_quantity: 0,
        measure_id: data.value.supply.measure_id,
        location_id: data.value.supply.location_id
    })
}

const changeToggle = (value, index) => {
    value && (dataTable.value[index].supply_action = SUPPLY_ACTIONS.UPDATE)

    if (!value) {
        dataTable.value[index].quantity = dataTable.value[index].original_quantity
        dataTable.value[index].cost = dataTable.value[index].original_cost

        dataTable.value[index].supply_action = ''
    }
}

const openInvoice = (invoiceId) => {
    tabsStore.openTab({ name: 'SuppliesShowInvoice', params: { id: invoiceId } })
}

const getDiff = (original, current) => {
    if (original > current) return original - current

    if (current > original) return current - original
}

</script>

<template>
    <TableUI
        :columns="columns"
        v-model:data="dataTable"
        :multipleOpen="false"
        class="mb-3">
        <template v-slot:row="{ row, index }">
            <tr v-if="row"
                :class="{
                    'bg-amber-50' : row.supply_action === SUPPLY_ACTIONS.UPDATE,
                    'bg-gray-50 line-through text-gray-400': row.supply_action === SUPPLY_ACTIONS.DELETE,
                    'bg-green-50': row.supply_action === SUPPLY_ACTIONS.CREATE}">
                <!-- Product icon -->
                <td
                    v-if="mode === 'edit'"
                    class="bg-primary-50">
                    <div class="w-full flex justify-center ">
                        <ToggleSwitch
                            v-if="!!row.id && row.supply_action !== SUPPLY_ACTIONS.DELETE"
                            v-model="dataTable[index].modified"
                            container-class="none"
                            @update:model-value="(value) => changeToggle(value, index)" />
                    </div>
                </td>

                <!-- Item name -->
                <td v-if="mode === 'edit'">
                    <button
                        v-if="row.supply_action !== SUPPLY_ACTIONS.DELETE"
                        @click="openInvoice(row.supply_order_id)"
                        class="link !text-primary-500">{{ row?.id ? showUuid(row?.id) : '' }}</button>

                    <span v-if="row.supply_action === SUPPLY_ACTIONS.DELETE">{{ row?.id ? showUuid(row?.id) : '' }}</span>
                </td>

                <!-- Quantity -->
                <td>
                    <span
                        v-if="[SUPPLY_ACTIONS.DELETE, ''].includes(row.supply_action) || mode === 'readonly'"
                        class="flex mt-2 !px-8 justify-end w-full">
                        {{ row?.quantity }}

                        <span
                            v-if="row.original_quantity !== row.quantity && [SUPPLY_ACTIONS.UPDATE].includes(row.supply_action)"
                            :class="{
                                'text-green-500': row.original_quantity < row.quantity,
                                'text-red-500': row.original_quantity > row.quantity
                            }">
                            <Icon
                                :icon="row.original_quantity < row.quantity ? mdiArrowUpThin : mdiArrowDownThin"
                                size="xs" /> {{ getDiff(row.original_quantity, row.quantity) }}
                        </span>
                    </span>

                    <Input
                        v-if="[SUPPLY_ACTIONS.CREATE, SUPPLY_ACTIONS.UPDATE].includes(row.supply_action) && mode === 'edit'"
                        v-model="row.quantity"
                        :errors="(errorsModel && errorsModel[`${errorsId}.${index}.quantity`]) || (gridErrors[index])? ' ': null"
                        :placeholder="$t('Quantity')"
                        containerClass="!mt-0 !pt-0"
                        inputClass="text-right"
                        :type="'number'"
                        :step="'1'"
                        :min="'0'" />
                </td>

                <!-- Cost -->
                <td>
                    <span
                        v-if="[SUPPLY_ACTIONS.DELETE, ''].includes(row.supply_action) || mode === 'readonly'"
                        class="flex mt-2 !px-8 justify-end w-full">
                        ${{ row?.cost }}

                        <span
                            v-if="row.original_cost !== row.cost && [SUPPLY_ACTIONS.UPDATE].includes(row.supply_action)"
                            :class="{
                                'text-green-500': row.original_cost < row.cost,
                                'text-red-500': row.original_cost > row.cost
                            }">
                            <Icon
                                :icon="row.original_cost < row.cost ? mdiArrowUpThin : mdiArrowDownThin"
                                size="xs" /> ${{ getDiff(row.original_cost, row.cost) }}
                        </span>
                    </span>

                    <Input
                        v-if="[SUPPLY_ACTIONS.CREATE, SUPPLY_ACTIONS.UPDATE].includes(row.supply_action) && mode === 'edit'"
                        v-model="row.cost"
                        :errors="(errorsModel && errorsModel[`${errorsId}.${index}.cost`]) || (gridErrors[index])? ' ': null"
                        :placeholder="$t('Cost')"
                        containerClass="!mt-0 !pt-0"
                        inputClass="text-right"
                        inline-label-left="$"
                        :type="'number'"
                        :step="'1'"
                        :min="'0'" />
                </td>

                <!-- Unit of measure -->
                <td>
                    <span
                        v-if="mode == 'readonly' || !row.custom_product"
                        class="flex mt-2">
                        {{ getMeasureName(row?.measure_id) }}
                    </span>
                </td>

                <td>
                    <span
                        v-if="mode == 'readonly' || !row.custom_product"
                        class="flex mt-2">
                        {{ getLocationName(row?.location_id) || data.supply?.location?.name }} 
                    </span>
                </td>

                <!-- Action buttons -->
                <td v-if="mode === 'edit'">
                    <div class="w-full flex justify-center">
                        <!-- Delete -->
                        <Button
                            v-if="row.supply_action !== SUPPLY_ACTIONS.DELETE"
                            class="mt-2"
                            :icon="mdiTrashCanOutline"
                            size="lg"
                            flat
                            rounded
                            color="secondary"
                            iconClass="hover:text-red-500"
                            @click="onRemove(item, index)" />

                        <!-- Redo -->
                        <Button
                            v-if="row.supply_action === SUPPLY_ACTIONS.DELETE"
                            class="mt-2"
                            :icon="mdiArrowULeftBottom"
                            size="lg"
                            flat
                            rounded
                            color="secondary"
                            iconClass="hover:text-red-500"
                            @click="onRemove(item, index)" />
                    </div>
                </td>
            </tr>
        </template>
    </TableUI>

    <div
        v-if="mode === 'edit'"
        class="flex justify-end pr-8">
        <Button
            rounded
            color="success"
            :icon="mdiPlus"
            @click="onAdd" />
    </div>
</template>
