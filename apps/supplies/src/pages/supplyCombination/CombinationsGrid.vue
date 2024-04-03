<script setup>
import { TableUI, Button, Title } from 'layout'
import { computed, inject, nextTick, onMounted } from 'vue'
import { defineModel, showUuid, uuid } from 'shared'
import { mdiSourceMerge, mdiArrowDown, mdiArrowUp } from '@mdi/js'
import SlideOverActions from './SlideOverActions.vue'
import { useSlideOver as useSlideComposable } from './useSlideOver'
import { Input } from 'form'

import { 
    mdiTrashCanOutline,
    mdiArrowULeftBottom
} from '@mdi/js'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const CUSTOM_SUPPLY_ID = '4fe13238-cus1-16f3-b184-b772fabf2zzz'

const props = defineProps({
    items: {
        type: Array,
        default: () => ([])
    },
    mode: String,
})

const useGlobalStore = inject('useGlobalStore')
const parametersStore = useGlobalStore('parameters')
const useSlideOver = useSlideComposable()

const { configSlideOver, action, data, setOnAfterSave } = useSlideOver

const dataModel = defineModel('items')

const getColumns = computed(() => {
    const columns = [
        {
            field: 'id',
            name: 'ID',
            align: 'left',
            customClass: '!w-1/12' 
        },
        {
            field: 'name',
            name: t('Name'),
            align: 'left',
            customClass: '!w-2/12'
        },
        {
            field: 'quantity',
            name: t('Available'),
            align: 'left',
            customClass: '!w-1/12'
        },
        {
            field: 'quantity',
            name: t('Quantity to be combined'),
            align: 'left',
            customClass: '!w-1/12'
        },
        {
            field: 'quantity',
            name: t('Remaining'),
            align: 'left',
            customClass: '!w-1/12'
        },

        {
            field: 'unit_of_measure',
            name: t('Unit of measure'),
            align: 'left',
            customClass: '!w-1/12'
        },
        {
            field: '',
            name: '',
            align: 'left',
            customClass: `!w-[3%] ${props.mode === 'creator' ? '' : 'hidden'}` 
        },
    ]

    return columns
})

const combineItems = () => {
    action.value = 'Combine'

    data.value.supplies = dataModel.value.filter(item => item.selectedCombine)

    configSlideOver.value.open = !configSlideOver.value.open

    setOnAfterSave('Combine', (response) => {
        if(response.errors) return

        const newSupplyList = []

        const supplyIdCombined = data.value.supplies.map(item => item.id)

        for (const item of dataModel.value) {
            if (!supplyIdCombined.includes(item.id)) newSupplyList.push(item)
        }
    
    
        let combinedItems = []
    
        for (const supply of data.value.supplies) {
            supply.combinedItems?.length ? (combinedItems = combinedItems.concat(supply.combinedItems)) : combinedItems.push(supply)
        }

        newSupplyList.unshift({
            id: uuid(),
            receptionId: '-',
            name: data.value.supply?.name || data.value.supply,
            supply_id: data.value.supply?.id || CUSTOM_SUPPLY_ID,
            custom: !data.value.supply?.name,
            quantity: data.value.quantity,
            measure_id: data.value.measure_id,
            location_id: data.value.location_id,
            category_id: data.value.category_id,
            measure: parametersStore.getItemById(data.value.measure_id),
            location: parametersStore.getItemById(data.value.location_id),
            category: parametersStore.getItemById(data.value.category_id),
            sku: data.value.sku,
            description: data.value.description,
            isOpen: true,
            selectedCombine: false,
            unit_price: data.value.price,
            combinedItems
        })
        
        dataModel.value = newSupplyList

        data.value = {}
    })
}

const SUPPLY_ACTIONS = {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete'
}

const onRemove = (item, index) => {
    if (dataModel.value[index]?.id) {
        dataModel.value[index].supply_action = dataModel.value[index].supply_action === SUPPLY_ACTIONS.DELETE ? '' : SUPPLY_ACTIONS.DELETE

        return
    }

    // dataModel.value.splice(index, 1)
}

onMounted(() => {
    nextTick(() => {
        dataModel.value = dataModel.value.map(model => {
            return {
                ...model,
                quantity_to_be_combined: 0
            }
        })
    })
})
</script>

<template>
    <Title
        :title="data?.order_supplies?.invoiceNumber? $t(`Invoice information`) : $t(`Part items`)"
        :hasBorderBottomLine="false"
        titleType="h2"
        class="font-semibold">
<!--         <template v-slot:rightTitle>
            <Button
                v-if="mode === 'creator'"
                size="sm"
                :disabled="dataModel.filter(item => item.selectedCombine).length < 2"
                color="primary"
                :icon="mdiSourceMerge"
                :label="$t('Combine items')"
                @click="combineItems" />
        </template> -->
    </Title>

    <TableUI
        :columns="getColumns"
        v-model:data="dataModel">
        <template v-slot:row="{ row, index, toggleExpansion }">
            <tr
                :class="{
                    'bg-gray-50 line-through text-gray-400': row.supply_action === SUPPLY_ACTIONS.DELETE,
                }">
                <!-- ID -->
                <td>
                    {{ showUuid(row.id) }}
                </td>

                <!-- Name -->
                <td>
                    {{ row.name }}
                </td>

                <!-- Quantity available -->
                <td class="text-right">
                    <div :class="`!pr-4 ${ row.quantity_to_be_combined > row.quantity && row.supply_action !== SUPPLY_ACTIONS.DELETE ? 'text-red-500' : '' }`">
                        {{ row.quantity }}
                    </div>
                </td>

                <!-- Quantity to be combined -->
                <td class="text-right">
                    <Input
                        v-model="row.quantity_to_be_combined"
                        :disabled="row.supply_action === SUPPLY_ACTIONS.DELETE"
                        :readonly="row.supply_action === SUPPLY_ACTIONS.DELETE"
                        :max="row.quantity"
                        :errors="null"
                        :placeholder="$t('Quantity')"
                        containerClass="!mt-0 !pt-0"
                        :inputClass="[`text-right ${ row.quantity_to_be_combined > row.quantity ? 'bg-red-100' : '' }`]"
                        :type="'number'"
                        :step="'1'"
                        :min="'0'" />
                </td>

                <!-- Quantity remaining -->
                <td class="text-right">
                    <div :class="`pr-4 ${ row.quantity_to_be_combined > row.quantity && row.supply_action !== SUPPLY_ACTIONS.DELETE ? 'text-red-500' : ''}`">
                        {{ row.quantity - row.quantity_to_be_combined }}
                    </div>
                </td>

                <!-- Unit of measure -->
                <td>
                    {{ row.measure?.name }}
                </td>

                <!-- Action buttons -->
                <td v-if="mode === 'creator'">
                    <div class="w-ful flex justify-center">
                        <!-- Remove action -->
                        <Button 
                            v-if="row.supply_action !== SUPPLY_ACTIONS.DELETE" 
                            @click="onRemove(row, index)"
                            :icon="mdiTrashCanOutline"
                            size="lg"
                            flat
                            rounded
                            color="secondary"
                            icon-class="hover:text-red-500 transition" />

                        <!-- Redo action -->
                        <Button 
                            v-if="row.supply_action === SUPPLY_ACTIONS.DELETE"
                            @click="onRemove(row, index)"
                            :icon="mdiArrowULeftBottom"
                            size="lg"
                            flat
                            rounded
                            color="secondary"
                            icon-class="hover:text-primary-500 transition" />
                    </div>
                </td>
            </tr>
        </template>
    </TableUI>

    <SlideOverActions
        :use-slide-over="useSlideOver" />
</template>