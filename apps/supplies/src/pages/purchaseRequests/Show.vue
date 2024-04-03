<script setup>
import { usePurchaseRequest as useComposable } from './usePurchaseRequest'
import DocumentWrapper from '../../components/DocumentWrapper.vue'

import PurchaseRequest from './PurchaseRequest.vue'
import { inject, onMounted, ref } from 'vue'
import { configButtons } from './configButtons'
import { api } from '@/config'
import { configSchema } from './configSchema'
import { useI18n } from 'vue-i18n'
import { Overlay } from 'layout'
import { formatDate, formatDiffForHumans } from 'shared'

const { t } = useI18n()

const router = inject('router')

const id = router.currentRoute.value.params.id
const overlay = ref(true)

const usePurchaseRequest = useComposable({ configSchema })
const useGlobalStore = inject('useGlobalStore')
const rapidStore = useGlobalStore('rapidStore')

const { data, variables } = usePurchaseRequest

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderType: router.currentRoute.value.query.supplyOrderType
}

const formatData = (purchaseRequestData) => {
    data.value = {
        ...purchaseRequestData,
        ...purchaseRequestData.request_user,
        id: purchaseRequestData.id,
        note: purchaseRequestData.note,
        deliveryInformation: {
            requested_delivery_date: purchaseRequestData.requested_delivery_date ? formatDate(purchaseRequestData.requested_delivery_date) : null,
            instructions: purchaseRequestData.instructions || `- ${t('No instructions were provided')} -`
        },
        request_item: purchaseRequestData?.supply_item_requests || [{}],
        requester: {
            ...purchaseRequestData.supply_order_approvals[0],
            requester_date: formatDate(purchaseRequestData.updated_at)
        },
        approvals: purchaseRequestData?.supply_order_approvals.map(e => {
            return {
                department: e?.approval_department || '-',
                name: e?.approval_name || '-',
                position: e?.approval_position || '-',
                email: e?.approval_email || '-',
                phone: e?.approval_phone || '-',
                approvedOn: e?.date_approval_or_reject ? `${formatDate(e?.date_approval_or_reject)} (${formatDiffForHumans(e.date_approval_or_reject)})` : '-',
                status: e?.supply_order_approval_status.name || '-',
                supply_order_approval_status: e?.supply_order_approval_status,
                note: e?.note_approval_or_reject || '-'
            }
        }).filter(e => !['requested', 'dispatched'].includes(e.supply_order_approval_status.slug))
    }
}

onMounted(async () => {
    if (id) {
        const response = await api.get(`/supplies/purchase_request_show/${id}`)

        overlay.value = false

        if (response.success) {
            formatData(response.data)
        }

        if (response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }
})

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    type: 'primary',
    confirmation: null,
    showAlert: false,
    modelData: '',
    component: null
})

const buttons = configButtons({ useGlobalStore, usePurchaseRequest, configModal })
</script>

<template>
    <!-- Confirmation Modal -->
    <Component
        :is="configModal.component"
        :config="configModal" />

    <Overlay
        v-if="overlay"
        class="z-50"/>

    <DocumentWrapper
        v-if="data.id"
        :buttons="buttons">
        <PurchaseRequest
            :usePurchaseRequest="usePurchaseRequest" />
    </DocumentWrapper>
</template>
