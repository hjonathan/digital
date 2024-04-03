<script setup>
import { inject, computed, ref, nextTick } from 'vue'
import { Button, TableUI, Icon, Overlay } from 'layout'
import { Input, Treeselect, AutoComplete } from 'form'
import { mdiCannabis, mdiTrashCanOutline, mdiPlus, mdiArrowUpThin, mdiArrowDownThin } from '@mdi/js'

import SvgIcon from '@jamescoyle/vue-icon'
import { defineModel } from 'shared'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    useMaterialAssign: Object,
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

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const suppliesStore = useGlobalStore('supplies')
const parametersStore = useGlobalStore('parameters')

const errorsModel = defineModel('errors')
const errorsId = 'requisition_supplies'

const { getQuantity, gridErrors } = props.useMaterialAssign

const dataTable = defineModel('data')

const columns = computed(() => {
    const columns = [
        {
            field: 'vendor.name',
            name: t(''),
            align: 'left',
            customClass: '!w-1/12'
        },
        {
            field: 'invoice.number',
            name: t('Item name'),
            align: 'left',
            customClass: '!w-6/12'
        },
        {
            field: 'invoice.number',
            name: t('Quantity'),
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
            name: '',
            align: 'right',
            customClass: '!w-1/12'
        },
    ]

    columns.splice(2, 0, {
        field: 'invoice.number',
        name: t('Available qty'),
        align: 'left',
        customClass: '!w-2/12'
    })

    return columns
})

const supplies = computed(() => {
    const suppliesSelected = dataTable.value.map(element => element.supply?.id).filter(supplyId => supplyId)

    return suppliesStore.getData().filter(supply => !suppliesSelected.includes(supply.id))
})

const measures = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('measures')
})

const onRemove = (item, index) => {
    dataTable.value.splice(index, 1)

    updateErrorMaximunQty()
}

const onAdd = () => {
    dataTable.value.push({})
}

const change = (row, index) => {
    nextTick(() => {
        row.measure = row.supply?.measure || {}
    })
}

const updateErrorMaximunQty = () => {
    gridErrors.value = []

    dataTable.value.forEach((e, index) => {
        change(e, index)
    })
}

</script>

<template>
    <TableUI
        :columns="columns"
        v-model:data="dataTable"
        :multipleOpen="false"
        class="mb-3">
        <template v-slot:row="{ row, index }">
            <tr v-if="row">
                <!-- Product icon -->
                <td>
                    <div class="w-full flex justify-center">
                        <svg-icon
                            type="mdi"
                            :path="mdiCannabis"
                            class="w-10 h-min print-tiny-icon" />
                    </div>
                </td>

                <!-- Item name -->
                <td>
                    <span
                        v-if="mode == 'readonly'"
                        class="mt-2">
                        {{ row?.name }}
                    </span>

                    <AutoComplete
                        v-if="mode == 'edit'"
                        @update:model-value="change(row, index)"
                        v-model="row.supply"
                        :force-selection="true"
                        :options="supplies"
                        :errors="errorsModel && (errorsModel[`${errorsId}.${index}.supply_id`] || errorsModel[`${errorsId}.${index}.name`])? ' ': null"
                        containerClass="!mt-0 !pt-0"
                        :placeholder="t('Select')" />
                </td>

                <!-- Remaining quantity -->
                <td >
                    <span
                        :class="{
                            'flex mt-2 !px-8 justify-end w-full': true,
                            'text-red-600': row.supply?.quantity > getQuantity(row),
                            'text-green-600': row.supply?.quantity < getQuantity(row),
                        }">

                        <Icon
                            v-if="row.supply?.quantity !== getQuantity(row)"
                            :icon="row.supply?.quantity < getQuantity(row) ? mdiArrowUpThin : mdiArrowDownThin"
                            size="xs" />
                                {{ getQuantity(row) || 0 }}

                    </span>
                </td>

                <!-- Quantity -->
                <td>
                    <span
                        v-if="mode == 'readonly'"
                        class="flex mt-2 !px-8 justify-end w-full">
                        {{ row?.quantity }}
                    </span>

                    <Input
                        @update:model-value="change(row, index)"
                        v-if="mode == 'edit'"
                        v-model="row.quantity"
                        :errors="(errorsModel && errorsModel[`${errorsId}.${index}.quantity`]) || (gridErrors[index])? ' ': null"
                        :placeholder="$t('Quantity')"
                        containerClass="!mt-0 !pt-0"
                        inputClass="text-right"
                        :type="'number'"
                        :step="'1'"
                        :min="'0'" />
                </td>

                <!-- Unit of measure -->
                <td>
                    <span
                        v-if="mode == 'readonly' || !row.custom_product"
                        class="flex mt-2">
                        {{ row?.measure?.name }}
                    </span>

                    <Treeselect
                        v-if="mode == 'edit' && row.custom_product"
                        v-model="row.measure_id"
                        :errors="errorsModel && errorsModel[`${errorsId}.${index}.measure_id`]? ' ': null"
                        :options="measures"
                        placeholder="Select"
                        class="input"
                        containerClass="!mt-0 !pt-0" />
                </td>

                <td>
                    <div class="w-full flex justify-center">
                        <Button
                            v-if="mode == 'edit'"
                            :disabled="dataTable.length < 2"
                            class="mt-2"
                            :icon="mdiTrashCanOutline"
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
