<script setup>
import { useInvoice as useComposable } from './useInvoice'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'
import Invoice from './Invoice.vue'
import { computed, inject, onMounted, ref } from 'vue'
import { configButtons } from './configButtons'
import { getSessionJSON, showUuid } from 'shared'
import { configSchema } from './configSchema'
import { ConfirmationModal } from 'layout'

const router = inject('router')

const useAdditionalCosts = useComposableAdditionalCosts()
const useInvoice = useComposable({ configSchema, useAdditionalCosts })

const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')
const facilitiesStore = useGlobalStore('facilities')
const unknownSuppliesStore = useGlobalStore('unknownSupplies')

const { data, variables, uniqueItem, unknownItems } = useInvoice

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderType: router.currentRoute.value.query.supplyOrderType,
    processStageDocumentTypeId: router.currentRoute.value.query.processStageDocumentTypeId,
    documentType: router.currentRoute.value.query.documentType
}

data.value = {
    ...data.value,
    ...coreStore.credentials?.user,
    facility: computed(() => {
        const facilityId = getSessionJSON('facility_id')

        const exists = facilitiesStore.getData().find(facility => facility.id === facilityId)

        return exists || {}
    })
}

onMounted(async () => {
    if (variables.value.documentType) uniqueItem.value = true

    if (router.currentRoute.value.query.itemId) {
        const items = await unknownSuppliesStore.fetch()

        data.value.requisition_supplies = items
            .filter(unknownSupply => router.currentRoute.value.query.itemId.includes(unknownSupply.id))
            .map(unknownSupply => ({
                ...unknownSupply,
                item_id: showUuid(unknownSupply.id),
                supply_draft_id: unknownSupply.id,
                unit_price: unknownSupply.price
            }))

        unknownItems.value = true
    }
   
})

delete data.value.id

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const buttons = configButtons({ useGlobalStore, useInvoice, configModal })
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
        <Invoice
            :useInvoice="useInvoice"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>
</template>
