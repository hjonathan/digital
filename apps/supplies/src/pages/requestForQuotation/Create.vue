<script setup>
import { useRequestForQuotation as useComposable } from './useRequestForQuotation'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import RequestForQuotation from './RequestForQuotation.vue'
import { computed, inject, onMounted, ref } from 'vue'
import { configButtons } from './configButtons'
import { getSessionJSON } from 'shared'
import { ConfirmationModal } from 'layout'
import { ToggleSwitch } from 'form'

const router = inject('router')

const useRequestForQuotation = useComposable({ })
const useGlobalStore = inject('useGlobalStore')
const coreStore = useGlobalStore('core')
const facilitiesStore = useGlobalStore('facilities')
const purchaseRequestStore = useGlobalStore('purchaseRequest')

const purchaseRequest = ref()

const { data, variables, uniqueItem } = useRequestForQuotation

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderType: router.currentRoute.value.query.supplyOrderType,
    processStageDocumentTypeId: router.currentRoute.value.query.processStageDocumentTypeId
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
    uniqueItem.value = !!variables.value.supplyOrderId

    if (variables.value.supplyOrderId) {
        purchaseRequest.value = await purchaseRequestStore.fetchRequestById(variables.value.supplyOrderId)

        const supplyItemRequest = purchaseRequest.value.supply_item_requests[0]

        data.value.requisition_supplies = [{
            name: supplyItemRequest?.name,
            measure_id: supplyItemRequest?.measure_id,
            quantity: supplyItemRequest?.quantity
        }]
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

const buttons = configButtons({ useGlobalStore, useRequestForQuotation, configModal })
</script>

<template>
    <ConfirmationModal
        :title="configModal.title"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        :show-errors="false"
        class="z-50">
        <template #content>
            <section class="w-full p-0">
                <ToggleSwitch
                    v-model="configModal.modelData.send_mail"
                    name="lot"
                    :label="$t(`Send by email to all suppliers?`)" />

                <ToggleSwitch
                    v-model="configModal.modelData.send_copy_mail"
                    name="lot"
                    :label="$t(`Send me a copy?`)" />
            </section>
        </template>
    </ConfirmationModal>

    <!-- Document wraper -->
    <DocumentWrapper
        :buttons="buttons">
        <RequestForQuotation
            :useRequestForQuotation="useRequestForQuotation" />
    </DocumentWrapper>
</template>
