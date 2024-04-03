<script setup>
import { useRequestForQuotation as useComposable } from './useRequestForQuotation'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import RequestForQuotation from './RequestForQuotation.vue'
import { computed, inject, onMounted, ref } from 'vue'
import AlertModal from '../../components/alertModal/AlertModal.vue'
import { configButtons } from './configButtons'
import { api } from '@/config'
import { formatDate } from 'shared'
import { Overlay } from 'layout'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = inject('router')

const id = router.currentRoute.value.params.id
const overlay = ref(true)

const useAlertModal = useComposableModal({})

const useRequestForQuotation = useComposable()
const useGlobalStore = inject('useGlobalStore')
const facilitiesStore = useGlobalStore('facilities')
const rapidStore = useGlobalStore('rapidStore')

const buttons = configButtons({ useGlobalStore, useRequestForQuotation, useAlertModal })

const { data, variables } = useRequestForQuotation

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderTypeId: router.currentRoute.value.query.supplyOrderTypeId
}

onMounted(async () => {
    if (id) {
        const response = await api.get(`/supplies/request_quotation_show/${id}`)

        overlay.value = false

        if (response.success) {
            formatData(response.data)
        }

        if (response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }
})

const formatData = (requestForQuotationData) => {
    data.value = {
        ...requestForQuotationData,
        ...requestForQuotationData.request_user,
        facility: computed(() => {
            const exists = facilitiesStore.getData().find(facility => facility.id === requestForQuotationData.request_user?.id)

            return exists || {}
        }),
        requisition_supplies: requestForQuotationData.supply,
        delivery_information: {
            requested_delivery_date: requestForQuotationData.requested_delivery_date ? formatDate(requestForQuotationData.requested_delivery_date) : null,
            instructions: requestForQuotationData.instructions || `- ${t('No instructions were provided')} -`
        },
        requested_date: formatDate(requestForQuotationData.requested_date),
        id: requestForQuotationData.id,
        submit_date: formatDate(requestForQuotationData.submit_date),
        vendors: [
            {
                vendor: requestForQuotationData.vendor
            },
        ]
    }
}
</script>

<template>
    <Overlay
        v-if="overlay"
        class="z-50" />

    <AlertModal
        :useAlertModal="useAlertModal" />

    <DocumentWrapper
        :buttons="buttons">
        <RequestForQuotation
            :useRequestForQuotation="useRequestForQuotation" />
    </DocumentWrapper>
</template>
