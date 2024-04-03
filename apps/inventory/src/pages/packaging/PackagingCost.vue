<script setup>
import { Button, TableUI } from 'layout'
import { AutoComplete, Input } from 'form'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { onMounted, ref, inject, computed, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import { useI18n } from 'vue-i18n'
import { mdiPlus } from '@mdi/js'
import { cloneDeep, isEqual } from 'lodash'
import { defineModel, round } from 'shared'
import { getItemCost, getType } from './packagingCost'

const props = defineProps({
    row: Object,
    element: Object,
    index: String || Number
})

const { t } = useI18n()
const useGlobalStore = inject('useGlobalStore')
const suppliesStore = useGlobalStore('supplies')
const coreStore = useGlobalStore('core')

const supplies = computed(() => {
    return suppliesStore.getData()
})

const element = defineModel('element')

const myChart = ref()
const data = ref(getItemCost(props.row.finished_god_type_id, props.row.brand_id))

const columns = ref([
    { field: 'name', name: 'Material', align: '', customClass: '' },
    { field: 'qty_fixed', name: 'Qty fixed', align: 'center', customClass: '' },
    { field: 'qty_unit', name: 'Qty p/unit', align: 'center', customClass: '' },
    { field: 'qty_lot', name: 'Qty lot units', align: 'center', customClass: '' },

    { field: 'unit_cost', name: 'Unit cost', align: 'center', customClass: '', permission: 'inventory.packaging.manager' },
    { field: 'total_cost', name: 'Total cost', align: 'center', customClass: '', permission: 'inventory.packaging.manager' },
    { field: 'actions', name: '', align: '', customClass: '' },
])

const drawEChart = () => {
    const option = {
        title: {
            text: t(`Materials : ${element.value.units_created} unit(s)  -  ${data.value.name}  -  ${getType(props.row.finished_god_type_id).name}`),
            left: 'center',
            textStyle: {
                fontSize: 12
            }
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '10%',
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['35%', '50%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 1
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: element.value.materials.map(e => ({
                    value: e.qty_fixed || round(e.qty_unit * element.value.units_created) || calculateLot(e) || 0,
                    name: e.name || null
                })).filter(e => e.name)
            },
        ]
    }

    option && myChart.value.setOption(option)
}

const remove = (index) => {
    element.value.materials.splice(index, 1)

    onChangeElement()
}

const add = (index) => {
    element.value.materials.push({ default: false, quantity: null, name: null })
}

const onChangeItem = (row, index) => {
    row.name = row.material?.name
    row.uom = row.material.measure.name
    row.unit_cost = 1

    onChangeElement()
}

const onChangeElement = () => {
    nextTick(() => {
        drawEChart()
    })
}

const calculateTotal = (row) => {
    if (row.qty_fixed) {
        return round(row.qty_fixed * row.unit_cost, 2)
    }

    if (row.qty_unit) {
        return round(row.qty_unit * element.value.units_created * row.unit_cost, 2)
    }

    if (row.qty_lot) {
        return round(calculateLot(row) * row.unit_cost, 2)
    }

    return 0
}

const calculateLot = (row) => {
    if (element.value.units_created % row.qty_lot > 0) {
        return Math.trunc(element.value.units_created / row.qty_lot) + 1
    }

    return 0
}

const calculateGrandTotal = computed((row) => {
    return element.value.materials.reduce((acc, value) => {
        acc = acc + calculateTotal(value)
        return acc
    }, 0)
})

onMounted(() => {
    element.value.materials = cloneDeep(data.value.materials)

    const chartDom = document.getElementById(`chart-${props.index}`)

    setTimeout(() => {
        myChart.value = echarts.init(chartDom)

        drawEChart()
    }, 200)
})

watch(() => element.value, (nValue, oValue) => {
    data.value = getItemCost(element.value.finished_god_type_id, element.value.brand_id)

    drawEChart()
}, { deep: true })

</script>

<template>
    <section class="flex max-w-7xl w-full">
        <div
            :id="`chart-${index}`" class="w-2/5" >
        </div>

        <div class="flex flex-col w-3/5 justify-end justify-items-end">
            <TableUI
                    v-if="element?.materials"
                    class=""
                    :columns="columns"
                    :show-footer="coreStore.getPermissions().includes('inventory.packaging.manager')"
                    v-model:data="element.materials"
                    :multipleOpen="false">
                    <template v-slot:row="{ row, index, toggleExpansion }">
                        <tr>
                            <td>
                                <div :class="['flex justify-between items-center',
                                    {
                                        'py-3': row.default !== false
                                    }]">
                                    <span v-if="row.default !== false">
                                        {{ $t(row.name) }}
                                    </span>

                                    <AutoComplete v-else
                                        class="w-60"
                                        v-model="row.material"
                                        @change="onChangeItem(element.materials[index], index)"
                                        :force-selection="false"
                                        :options="supplies"
                                        containerClass="!mt-0 !pt-0 w-50"
                                        :placeholder="t('Select')" />
                                </div>
                            </td>
                            <td class="text-right">
                                <span v-if="row.default !== false">
                                    {{ `${row.qty_fixed || ''}` }}
                                </span>
                                <Input
                                    v-else
                                    @change="onChangeElement"
                                    v-model="row.qty_fixed"
                                    :placeholder="$t('Quantity')"
                                    containerClass="!mt-0 !pt-0"
                                    inputClass="text-right"
                                    :type="'number'"
                                    :step="'1'"
                                    :min="'0'" >
                                </Input>
                            </td>
                            <td class="text-right">
                                <span v-if="row.default !== false">
                                    {{ `${row.qty_unit || ''}` }}
                                </span>
                                <Input
                                    v-else
                                    @change="onChangeElement"
                                    v-model="row.qty_unit"
                                    :placeholder="$t('Quantity')"
                                    containerClass="!mt-0 !pt-0"
                                    inputClass="text-right"
                                    :type="'number'"
                                    :step="'1'"
                                    :min="'0'" >
                                </Input>
                            </td>
                            <td class="text-right">
                                <span v-if="row.default !== false">
                                    {{ `${row.qty_lot || ''}` }}
                                </span>
                                <Input
                                    v-else
                                    @change="onChangeElement"
                                    v-model="row.qty_lot"
                                    :placeholder="$t('Quantity')"
                                    containerClass="!mt-0 !pt-0"
                                    inputClass="text-right"
                                    :type="'number'"
                                    :step="'1'"
                                    :min="'0'" >
                                </Input>
                            </td>
                            <td class="text-right" v-permission="{name:'inventory.packaging.manager'}">${{ row.unit_cost }}</td>
                            <td class="text-right" v-permission="{name:'inventory.packaging.manager'}">{{ calculateTotal(row) ? `$${calculateTotal(row)}`: 0 }}</td>
                            <td class="text-right w-full">
                                <div v-if="row.default === false"
                                    class="flex space-x-4">
                                    <TrashIcon
                                        @click="remove(index)"
                                        class="text-gray-800 cursor-pointer hover:text-red-400 w-5" />
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template #total>
                        <td colspan="4"></td>
                        <td class="text-left">{{ t('Total') }}</td>
                        <td class="text-right px-4">
                            <div class="font-bold py-3">
                                ${{ calculateGrandTotal }}
                            </div>
                        </td>
                        <td></td>
                    </template>
            </TableUI>
            <!--
            <div class="flex justify-end pt-2 px-8" v-permission="{name:'inventory.packaging.manager'}">
                <Button
                    @click="add(index)"
                    size="sm"
                    rounded
                    color="success"
                    :icon="mdiPlus"/>
            </div> -->
        </div>
    </section>
</template>
