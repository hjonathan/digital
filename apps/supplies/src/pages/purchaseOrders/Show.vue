<script setup>
import { usePurchaseOrder as useComposable } from './usePurchaseOrder'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'

import PurchaseOrder from './PurchaseOrder.vue'
import { inject, onMounted, ref } from 'vue'
import { configButtons } from './configButtons'
import { api } from '@/config'
import { configSchema } from './configSchema'
import { Overlay } from 'layout'

import { useI18n } from 'vue-i18n'
import { formatDiffForHumans, formatDate } from 'shared'

const { t } = useI18n()

const router = inject('router')

const id = router.currentRoute.value.params.id
const overlay = ref(true)

const useAdditionalCosts = useComposableAdditionalCosts()
const usePurchaseOrder = useComposable({ configSchema, useAdditionalCosts })

const useGlobalStore = inject('useGlobalStore')
const rapidStore = useGlobalStore('rapidStore')

const { data, variables } = usePurchaseOrder

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderTypeId: router.currentRoute.value.query.supplyOrderTypeId
}

const formatData = (purchaseOrderData) => {
    data.value = {
        ...purchaseOrderData,
        ...purchaseOrderData.request_user,
        request_date: {
            date: formatDate(purchaseOrderData.requested_date)
        },
        facility: purchaseOrderData.facility ? purchaseOrderData.facility : {},
        billing_payment_terms: purchaseOrderData.billing_payment_terms,
        delivery_information: purchaseOrderData.delivery_information,
        shipping_cost: purchaseOrderData.shipping_cost,
        requisition_supplies: purchaseOrderData.supply,
        vendor: purchaseOrderData.vendor,
        approvals: purchaseOrderData?.supply_order_approvals.map(e => {
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

    data.value.id = purchaseOrderData.id
}

onMounted(async () => {
    if (id) {
        const response = await api.get(`/supplies/purchase_order_show/${id}`)

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

const buttons = configButtons({ useGlobalStore, usePurchaseOrder, configModal })
</script>

<template>
    <!-- Confirmation Modal -->
    <Component
        :is="configModal.component"
        :config="configModal" />

    <Overlay
        v-if="overlay"
        class="z-50" />

    <DocumentWrapper
        v-if="data.vendor"
        :buttons="buttons">
        <PurchaseOrder
            :usePurchaseOrder="usePurchaseOrder"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>
</template>
