<script setup>
import { ref, inject, computed, onMounted, nextTick } from 'vue'
import { Button, TableUI } from 'layout'
import { Input, Treeselect, AutoComplete } from 'form'
import { mdiTrashCanOutline, mdiPlus } from '@mdi/js'
import { defineModel, round } from 'shared'
import { isObject, isString, cloneDeep } from 'lodash'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    usePurchaseOrder: Object,
    data: Array,
    mode: {
        type: String,
        default: 'edit'
    }, // view, edit
    errors: {
        type: Object,
        default: () => { return {} }
    }
})

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const suppliesStore = useGlobalStore('supplies')
const parametersStore = useGlobalStore('parameters')

const { uniqueItem } = props.usePurchaseOrder

// const errors = ref(props.errors)
const errorsId = 'requisition_supplies'

const supplies = computed(() => {
    return suppliesStore.getData()
})

const measures = computed(() => {
    return parametersStore.getTreeSelectDataBySlug('measures')
})

const columns = ref([
    {
        field: 'item.id',
        name: t('Item ID'),
        align: 'left',
        customClass: '!w-[20%]'
    },
    {
        field: 'invoice.number',
        name: t('Item name'),
        align: 'left',
        customClass: '!w-[30%]'
    },
    {
        field: 'item.price',
        name: t('Price'),
        align: '',
        customClass: '!w-[15%]'
    },
    {
        field: 'item.quantity',
        name: t('Quantity'),
        align: '',
        customClass: '!w-[15%]'
    },
    {
        field: 'item.measure_id',
        name: t('Unit of measure'),
        align: '',
        customClass: '!w-[13%]'
    },
    {
        field: 'invoice.number',
        name: t('Amount'),
        align: '',
        customClass: '!w-[15%]'
    },
])

const dataTable = defineModel('data')

const emit = defineEmits(['resetErrors'])

const onRemove = (item, index) => {
    dataTable.value.splice(index, 1)

    emit('resetErrors')
}

const onAdd = () => {
    dataTable.value.push({})

    emit('resetErrors')
}

const getAmount = (row) => {
    if (row.unit_price && row.quantity) {
        row.amount = round(row.unit_price * row.quantity, 2)

        return row.amount
    }

    return 0
}

const getMeasureName = (measureId) => {
    let name = '-'
    const measure = measures.value.find(item => item.id === measureId)

    if (measure) name = measure.label

    return name
}

const onChangeItem = (row, index) => {
    let element = cloneDeep(row)

    if (isObject(element.supply)) {
        element = {
            ...element,
            locked: true,
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
            locked: false,
            name: element.supply,
            measure_id: null,
            supply_id: '4fe13238-cus1-16f3-b184-b772fabf2zzz',
            custom_product: true
        }

        dataTable.value[index] = element
    }
}

onMounted(() => {
    nextTick(() => {
        if (!uniqueItem.value) {
            columns.value.push({
                field: 'invoice.number',
                name: '',
                align: 'right',
                customClass: `!w-1/12 ${props.mode === 'edit' ? 'block' : 'hidden'}`
            })
        }
    })
})
</script>

<template>
    <TableUI
        class="!mb-2"
        :columns="columns"
        v-model:data="dataTable"
        :multipleOpen="false">
        <template v-slot:row="{ row, index }">
            <tr>
                <!-- Item name -->
                <td>
                    <span
                        v-if="mode == 'readonly'"
                        class="mt-2 flex">
                        {{ row?.item_id }}
                    </span>

                    <Input
                        v-if="mode == 'edit'"
                        v-model="row.item_id"
                        :errors="errors && errors[`${errorsId}.${index}.item_id`]? ' ': null"
                        containerClass="!mt-0 !pt-0"
                        :placeholder="$t('Item ID')" />
                </td>

                <!-- Item name -->
                <td>
                    <span
                        v-if="mode == 'readonly'"
                        class="mt-2 flex">
                        {{ row?.name }}
                    </span>
                    <Input
                        v-if="mode == 'edit' && uniqueItem"
                        v-model="row.name"
                        :errors="errors && errors[`${errorsId}.${index}.name`]? ' ': null"
                        containerClass="!mt-0 !pt-0"
                        :placeholder="$t('Item name')" />

                    <AutoComplete
                        v-if="mode == 'edit' && !uniqueItem"
                        v-model="row.supply"
                        @change="onChangeItem(row, index)"
                        :force-selection="false"
                        :options="supplies"
                        :errors="errors && (errors[`${errorsId}.${index}.supply_id`] || errors[`${errorsId}.${index}.name`])? ' ': null"
                        containerClass="!mt-0 !pt-0"
                        :placeholder="t('Select')" />
                </td>

                <!-- Price -->
                <td>
                    <span
                        v-if="mode == 'readonly'"
                        class="flex mt-2 justify-end w-full pr-8">
                        ${{ row?.unit_price }}
                    </span>

                    <Input
                        v-if="mode == 'edit'"
                        v-model="row.unit_price"
                        :errors="errors && errors[`${errorsId}.${index}.unit_price`]? ' ': null"
                        :placeholder="$t('Price')"
                        inline-label-left="$"
                        containerClass="!mt-0 !pt-0"
                        inputClass="text-right"
                        :type="'number'"
                        :min="'0'" />
                </td>

                <!-- Quantity -->
                <td>
                    <span
                        v-if="mode == 'readonly' || uniqueItem"
                        class="flex mt-2 justify-end w-full pr-8">
                        {{ row?.quantity }}
                    </span>

                    <Input
                        v-if="mode == 'edit' && !uniqueItem"
                        v-model="row.quantity"
                        :errors="errors && errors[`${errorsId}.${index}.quantity`]? ' ': null"
                        containerClass="!mt-0 !pt-0"
                        inputClass="text-right"
                        :placeholder="$t('Quantity')"
                        :type="'number'"
                        :step="'1'"
                        :min="'0'" />
                </td>

                <!-- Unit of measure -->
                <td class="text-right">
                    <span
                        v-if="mode == 'readonly' || uniqueItem || !row.custom_product"
                        class="mt-2 w-full flex">
                        {{ getMeasureName(row.measure_id) }}
                    </span>

                    <!-- Measure -->
                    <Treeselect
                        v-if="mode == 'edit' && !uniqueItem && row.custom_product"
                        v-model="row.measure_id"
                        :errors="errors && errors[`${errorsId}.${index}.measure_id`]? ' ': null"
                        :options="measures"
                        :placeholder="$t('Select')"
                        class="input"
                        containerClass="!mt-0 !pt-0" />
                </td>

                <!-- Amount -->
                <td class="!p-0">
                    <span
                        class="flex mt-2 justify-end w-full !p-0">
                        ${{ getAmount(row) }}
                    </span>
                </td>

                <!-- Actions -->
                <td v-if="!uniqueItem && mode === 'edit'">
                    <div class="w-full flex justify-center">
                        <!-- Remove action -->
                        <Button
                            v-if="mode == 'edit'"
                            :disabled="dataTable.length === 1"
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
        v-if="mode==='edit' && !uniqueItem"
        class="flex justify-end pr-6">
        <Button
            rounded
            color="success"
            :icon="mdiPlus"
            @click="onAdd" />
    </div>
</template>
