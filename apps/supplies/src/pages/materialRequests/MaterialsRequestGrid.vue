<script setup>
import { inject, computed, ref, onMounted, onBeforeUpdate, watch } from 'vue'
import { Button, TableUI } from 'layout'
import { Input, Treeselect, AutoComplete } from 'form'
import { mdiCannabis, mdiTrashCanOutline, mdiPlus } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { defineModel } from 'shared'
import { isObject, isString, cloneDeep, isNumber, isEmpty } from 'lodash'
import { useI18n } from 'vue-i18n'

const props = defineProps({
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

const supplies = computed(() => {
    return suppliesStore.getData()
})

const measures = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('measures')
})

const dataTable = defineModel('data')

const gridErrors = ref({})

const onRemove = (item, index) => {
    dataTable.value.splice(index, 1)

    updateErrorMaximunQty()
}

const onAdd = () => {
    dataTable.value.push({})
}

const onChangeItem = (row, index) => {
    let element = cloneDeep(row)

    if (isObject(element.supply)) {
        element = {
            ...element,
            supply_id: element.supply.id,
            name: element.supply.name,
            cost: element.reference_price,
            custom_product: false,
            measure: element.supply.measure,
            measure_id: element.supply.measure_id
        }

        dataTable.value[index] = element
    }

    if (isString(element.supply)) {
        element = {
            ...element,
            name: element.supply,
            supply_id: '4fe13238-cus1-16f3-b184-b772fabf2zzz',
            custom_product: true
        }

        dataTable.value[index] = element
    }

    change(row, index)
}

const columns = computed(() => {
    const columns = [
        {
            field: 'vendor.name',
            name: '',
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
            name: t('Requested qty'),
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

    if (props.schema.role === 'warehouse') {
        columns.splice(2, 0, {
            field: 'invoice.number',
            name: t('Available qty'),
            align: 'left',
            customClass: '!w-2/12'
        })
    }

    return columns
})

const change = (row, index) => {
    if (props.schema.role === 'warehouse') {
        if (row.quantity > (row.supply?.quantity || 0)) {
            gridErrors.value[index] = true

            return
        }

        gridErrors.value[index] = false

        errorsModel.value[`${errorsId}.${index}.quantity`] = null

        return
    }

    gridErrors.value[index] = false
}

watch([() => dataTable.value.length, () => dataTable.value[0]], (newValue, oldValue) => {
    if (newValue[0] !== oldValue[0] || isEmpty(oldValue[1])) {
        updateErrorMaximunQty()
    }
})

const updateErrorMaximunQty = () => {
    gridErrors.value = {}

    if (props.schema.role === 'warehouse') {
        dataTable.value.forEach((e, index) => {
            change(e, index)
        })
    }
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
                        v-model="row.supply"
                        @change="onChangeItem(row, index)"
                        :force-selection="false"
                        :options="supplies"
                        :errors="errorsModel && (errorsModel[`${errorsId}.${index}.supply_id`] || errorsModel[`${errorsId}.${index}.name`])? ' ': null"
                        containerClass="!mt-0 !pt-0"
                        :placeholder="t('Select')" />
                </td>

                <!-- Remaining quantity -->
                <td v-if="schema.role === 'warehouse'">
                    <span
                        class="flex mt-2 !px-8 justify-end w-full">
                        {{ row?.supply?.quantity || 0 }}
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
                        @change="change(row, index)"
                        v-if="mode == 'edit'"
                        v-model="row.quantity"
                        :errors="(errorsModel && errorsModel[`${errorsId}.${index}.quantity`]) || (gridErrors[index] && schema.role ==='warehouse')? ' ': null"
                        :placeholder="$t('Quantity')"
                        containerClass="!mt-0 !pt-0"
                        inputClass="text-right"
                        :type="'number'"
                        :step="'1'"
                        :min="'0'" >
                    </Input>
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
