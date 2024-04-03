<script setup>
import { computed, inject, ref } from 'vue'

import { Title, Button, TableUI, Alert } from 'layout'
import { Input } from 'form'
import { defineModel } from 'shared'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const MODES = {
    READONLY: 'readonly',
    EDIT: 'edit'
}

const props = defineProps({
    mode: {
        type: String,
        default: 'readonly'
    },
    parts: {
        type: Array,
        default: () => ([])
    },
    completeItems: {
        type: Array,
        default: () => ([])
    },

    additionalCosts: {
        type: Object,
        default: null
    }
})

const router = inject('router')
const id = router.currentRoute.value.params.id

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')

const partsModel = defineModel('parts')
const completeItemsModel = defineModel('completeItems')

const errors = ref({})

const showParts = computed(() => {
    const partsModelClone = partsModel.value ? JSON.parse(JSON.stringify(partsModel.value)) : []

    return partsModelClone.splice(0, 4)
})


const showCompleteItems = computed(() => {
    const completeItemsModelClone = completeItemsModel.value ? JSON.parse(JSON.stringify(completeItemsModel.value)) : []

    return completeItemsModelClone.splice(0, 4)
})

const columnsCompleteItems = ref([
    { 
        name: t('Item'), 
        customClass: '!w-7/12' 
    },
    { 
        name: t('Quantity'), 
        align: 'right', 
        customClass: '!w-5/12' 
    }
])

const columnsParts = ref([
    { 
        name: t('Parts'), 
        customClass: '!w-7/12' 
    },
    { 
        name: t('Quantity'), 
        align: 'right', 
        customClass: '!w-5/12'
}])

const completeItemsSelected = computed(() => {
    return completeItemsModel.value.filter(item => item.selected)
})

const openCombinationForm = () => {
    tabsStore.openTab({ 
        name: 'SuppliesCombination',
/*         query: {
            receptionId: documentType.process_stage_documents.map(e => e.supply_order_id),
            processId: process.value.id,
            stageId: props.type.process_stage_id,
            processStageDocumentTypeId: props.type.id,
            supplyOrderType: 'combine-supply',
            documentType: 'combine-supply'
        } */
    })
}

const openEnableStockForm = async () => {
    errors.value = {}

    const response = await api.post('/supplies/enable_in_stock', {
        processId: id,
        item_list: completeItemsSelected.value.map(item => ({
            id: item.id,
            name: item.name,
            supply_id: item.supply_id,
            quantity: item.quantity,
            measure_id: item.measure_id,
            location_id: item.location_id,
            category_id: item.category_id
        }))
    })

    if (response.errors) errors.value = response.errors
}
</script>

<template>
    <section>
        <Title
            :title="$t('Summary')"
            title-type="h2"
            :has-padding="false" />

        <template v-if="mode === MODES.EDIT">
            <Title
                v-if="mode === MODES.EDIT && partsModel.length"
                :title="$t('Combination')"
                title-type="h4"
                :has-padding="false" />
    
            <TableUI
                v-if="mode === MODES.EDIT && partsModel.length"
                :columns="columnsParts"
                :data="partsModel">
                <template v-slot:row="{ row }">
                    <tr>
                        <td>{{ row.name }}</td>
                        <td class="text-end">{{ row.quantity }} {{ row.measure?.name }}</td>
                    </tr>
                </template>
            </TableUI>
    
            <Button
                v-if="mode === MODES.EDIT && partsModel.length"
                color="primary"
                :label="$t('Combine items')"
                size="sm"
                @click="openCombinationForm"
                class="w-full" />
    
            <Title
                v-if="mode === MODES.EDIT && completeItemsModel.length"
                :title="$t('Ready to transfer to supplies stock')"
                title-type="h4"
                :has-padding="false" />
    
            <TableUI
                :columns="columnsCompleteItems"
                :data="completeItemsModel">
                <template v-slot:row="{ row, index }">
                    <tr class="cursor-pointer">
                        <td :for="`checkbox-${index}`"  @click="completeItemsModel[index].selected = !completeItemsModel[index].selected">                        
                            <input
                                v-model="completeItemsModel[index].selected"
                                :id="`checkbox-${index}`" type="checkbox" class="mr-5">
    
                            {{ row.name }}
                        </td>
    
                        <td class="text-end">
                            <Input
                                v-model="completeItemsModel[index].quantity"
                                type="number"
                                :inline-label-right="row.measure?.name"
                                container-class="none"
                                outline
                                size="sm"
                                inputClass="text-right"
                                :errors="errors && errors[`completeItems.${index}.quantity`]" />
                        </td>
                    </tr>
                </template>
            </TableUI>
    
            <Alert
                v-if="!additionalCosts"
                type="info"
                :content="$t('It is necessary to fill in the shipping costs, please complete this information.')"
                :has-close-button="false" />

            <!-- TODO: Poner la validacion !additionalCosts ||    en el caso de que no tenga shipping cost -->
            <Button
                :disabled=" !completeItemsSelected.length"
                color="primary"
                :label="$t('Send to inventory stock')"
                size="sm"
                class="w-full"
                @click="openEnableStockForm" />
        </template>

        <template v-if="mode === MODES.READONLY">
            <Title
                v-if="partsModel.length"
                :title="$t('Received items')"
                title-type="h4"
                :has-padding="false" />
        </template>
    </section>
</template>