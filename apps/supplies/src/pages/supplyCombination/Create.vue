<script setup>
import { inject, onMounted, ref } from 'vue'

import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'
import { api } from '@/config'
import { configButtons } from './configButtons'

import Warehouse from './Warehouse.vue'

import { useWarehouse as useComposable } from './useWarehouse'

import { ConfirmationModal } from 'layout'

const router = inject('router')

const schema = ref({
    role: 'creator',
    shipping_cost: {
        mode: 'edit',
        show_view: false
    },
    sales_order: {
        mode: 'edit'
    }
})

const useAdditionalCosts = useComposableAdditionalCosts()
// const { setAdditionalCostsSchema } = useAdditionalCosts

const useWarehouse = useComposable({ schema: schema.value, useAdditionalCosts })


const useGlobalStore = inject('useGlobalStore')
const invoiceStore = useGlobalStore('invoice')
const unknownSuppliesStore = useGlobalStore('unknownSupplies')
const parametersStore = useGlobalStore('parameters')

const { data, variables, uniqueItem, receptionItems, vendor } = useWarehouse

const parts = ref([
    {
        id: '3263efa7-d4d2-475d-bc80-566e47f34441',
        name: 'Engine',
        quantity: 2,
        measure: {
            name: 'units'
        }
    },
    {
        id: '09d4d2f7-3289-4e5c-9c1c-15f5830a5467',
        name: 'Wheels',
        quantity: 11,
        measure: {
            name: 'units'
        }
    },
    {
        id: '1178a4ce-7749-4f15-83a9-c6e22745ca8b',
        name: 'Chasis',
        quantity: 2,
        measure: {
            name: 'units'
        }
    },
    {
        id: 'ac47c0a2-362d-4465-9367-41c160b421a8',
        name: 'Mixer',
        quantity: 2,
        measure: {
            name: 'units'
        }
    },
    {
        id: '6823df29-5525-4a48-aa8b-e9dc65bb5a00',
        name: 'Battery',
        quantity: 2,
        measure: {
            name: 'units'
        }
    },
    {
        id: '7e3f69bf-f7e3-492a-bdb0-59dcd1602057',
        name: 'Glasses',
        quantity: 20,
        measure: {
            name: 'units'
        }
    },
    {
        id: '1f4ecd21-acf1-45bf-bf03-c98ea4614b1e',
        name: 'Radio',
        quantity: 2,
        measure: {
            name: 'units'
        }
    },
    {
        id: '8a2601e8-e7fe-4c48-aead-02ad3eb33d7b',
        name: 'Table top',
        quantity: 2,
        measure: {
            name: 'units'
        }
    },
    {
        id: 'e75c8bde-fcb0-48c7-9b52-eee4deb61b5a',
        name: 'Table leg',
        quantity: 2,
        measure: {
            name: 'units'
        }
    },
    {
        id: '1ce2fbb3-3b16-44c2-bc4f-8ea77a46d282',
        name: 'Table wheel',
        quantity: 2,
        measure: {
            name: 'units'
        }
    }
])

onMounted(() => {
    receptionItems.value = parts.value
})

/*
const receptionIds = router.currentRoute.value.query.receptionId

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderType: router.currentRoute.value.query.supplyOrderType,
    processStageDocumentTypeId: router.currentRoute.value.query.processStageDocumentTypeId
}

onMounted(async () => {
    setAdditionalCostsSchema(data.value)

    data.value.order_supplies = variables.value.supplyOrderId ? null : {}

    if (variables.value.supplyOrderId) {
        uniqueItem.value = true

        schema.value.shipping_cost.mode = 'readonly'

        const response = await invoiceStore.fetchRequestById(variables.value.supplyOrderId)

        if (!response.vendor) response.vendor = {}

        data.value.order_supplies = response

        data.value.receiver.reception_date = moment(new Date()).format('DD/MM/YYYY')

        setAdditionalCostsSchema({ ...response, id: data.value?.id })
    }


    const responseReceipts = await unknownSuppliesStore.fetch()

    const receptions = responseReceipts.filter(reception => receptionIds.includes(reception.id))

    for (const reception of receptions) {
        if (reception) vendor.value = reception.vendor

        for (const supply of reception.supply) {
            receptionItems.value.push({
                ...supply,
                measure: parametersStore.getItemById(supply.measure_id),
                location: parametersStore.getItemById(supply.location_id),
                category: parametersStore.getItemById(supply.category_id),
                receptionId: reception.id,
                combinedItems: [],
                selectedCombine: false
            })   
        }
    }
})
*/

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const buttons = configButtons({ configModal, useWarehouse, useGlobalStore }) 
</script>

<template>
    <ConfirmationModal
        :title="configModal.title"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        class="z-50" />
    <DocumentWrapper
        :buttons="buttons">
        <Warehouse
            v-if="true"
            :schema="schema"
            :useWarehouse="useWarehouse"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>
</template>
