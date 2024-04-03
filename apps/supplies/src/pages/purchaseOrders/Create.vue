<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import PurchaseOrder from './PurchaseOrder.vue'
import { usePurchaseOrder as useComposable } from './usePurchaseOrder'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'
import { computed, inject, ref } from 'vue'
import { configButtons } from './configButtons'
import { getSessionJSON } from 'shared'
import { configSchema } from './configSchema'
import { ConfirmationModal } from 'layout'

const router = inject('router')

const useAdditionalCosts = useComposableAdditionalCosts()
const usePurchaseOrder = useComposable({ configSchema, useAdditionalCosts })

const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')
const facilitiesStore = useGlobalStore('facilities')

const { data, variables } = usePurchaseOrder

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

const buttons = configButtons({ useGlobalStore, usePurchaseOrder, configModal })
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
        <PurchaseOrder
            :usePurchaseOrder="usePurchaseOrder"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>
</template>
