<script setup>
import { ref, inject, computed, onMounted, nextTick } from 'vue'
import { Button, TableUI } from 'layout'
import { Input, Treeselect } from 'form'
import { mdiCannabis, mdiTrashCanOutline, mdiPlus } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { defineModel } from 'shared'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    useRequestForQuotation: Object,
    data: Array,
    mode: {
        type: String,
        default: 'readonly'
    }, // view, edit
    errors: {
        type: Object,
        default: () => { return {} }
    }
})

const useGlobalStore = inject('useGlobalStore')
const suppliesStore = useGlobalStore('supplies')
const parametersStore = useGlobalStore('parameters')

const { uniqueItem } = props.useRequestForQuotation

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
        customClass: '!w-2/12'
    },
    {
        field: 'invoice.number',
        name: t('Unit of measure'),
        customClass: '!w-2/12'
    },
])

const dataTable = defineModel('data')

const onRemove = (item, index) => {
    dataTable.value.splice(index, 1)
}

const onAdd = () => {
    dataTable.value.push({})
}

const getMeasureName = (measureId) => {
    let name = '-'
    const measure = measures.value.find(item => item.id === measureId)

    if (measure) name = measure.label

    return name
}

onMounted(() => {
    nextTick(() => {
        if (!uniqueItem.value) {
            columns.value.push({
                field: 'invoice.number',
                name: '',
                align: 'right',
                customClass: `!w-1/12 notPrintableArea ${props.mode === 'edit' ? ' visible' : 'hidden'}`
            })
        }
    })
})
</script>

<template>
    <TableUI
        class="mb-3"
        :columns="columns"
        v-model:data="dataTable"
        :multipleOpen="false">
        <template v-slot:row="{ row, index }">
            <tr>
                <!-- Product icon -->
                <td>
                    <div class="w-full flex justify-center">
                        <svg-icon
                            type="mdi"
                            :path="mdiCannabis"
                            class="w-10 print-tiny-icon h-min" />
                    </div>
                </td>

                <!-- Item name -->
                <td>
                    <span
                        v-if="mode === 'readonly'"
                        class="mt-2 flex">
                        {{ row?.name }}
                    </span>

                    <Input
                        v-if="mode == 'edit'"
                        v-model="row.name"
                        :errors="errors && errors[`${errorsId}.${index}.name`]? ' ': null"
                        containerClass="!mt-0 !pt-0"
                        :placeholder="$t('Item name')" />
                </td>

                <!-- Quantity -->
                <td>
                    <span
                        v-if="mode === 'readonly' || uniqueItem"
                        class="flex mt-2 pr-4 justify-end w-full">
                        {{ row?.quantity }}
                    </span>

                    <Input
                        v-if="mode == 'edit' && !uniqueItem"
                        v-model="row.quantity"
                        :errors="errors && errors[`${errorsId}.${index}.quantity`]? ' ': null"
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
                        v-if="mode === 'readonly' || uniqueItem"
                        class="mt-2 w-full flex">
                        {{ getMeasureName(row.measure_id) }}
                    </span>

                    <!-- Measure -->
                    <Treeselect
                        v-if="mode == 'edit' && !uniqueItem"
                        v-model="row.measure_id"
                        :errors="errors && errors[`${errorsId}.${index}.measure_id`]? ' ': null"
                        :options="measures"
                        placeholder="Select"
                        class="input"
                        containerClass="!mt-0 !pt-0" />
                </td>

                <!-- Actions -->
                <td
                    v-if="mode == 'edit' && !uniqueItem"
                    class="notPrintableArea">
                    <div class="w-full flex justify-center">
                        <Button
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

    <!-- Add button -->
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
