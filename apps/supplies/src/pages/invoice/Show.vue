<script setup>
import { useInvoice as useComposable } from './useInvoice'
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'
import { inject, onMounted, ref } from 'vue'
import { configButtons } from './configButtons'
import { api } from '@/config'
import { configSchema } from './configSchema'
import Invoice from './Invoice.vue'
import { useI18n } from 'vue-i18n'
import { Overlay } from 'layout'

const { t } = useI18n()

const router = inject('router')

const id = router.currentRoute.value.params.id
const overlay = ref(true)

const useAdditionalCosts = useComposableAdditionalCosts()
const useInvoice = useComposable({ configSchema, useAdditionalCosts })

const useGlobalStore = inject('useGlobalStore')
const rapidStore = useGlobalStore('rapidStore')

const { data, variables } = useInvoice

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
            date: purchaseOrderData.requested_date
        },
        facility: purchaseOrderData.facility ? purchaseOrderData.facility : {},
        billing_payment_terms: purchaseOrderData.billing_payment_terms,
        delivery_information: purchaseOrderData.delivery_information,
        shipping_cost: purchaseOrderData.shipping_cost,
        requisition_supplies: purchaseOrderData.supply,
        vendor: purchaseOrderData.vendor
    }

    data.value.id = purchaseOrderData.id
}

onMounted(async () => {
    if (id) {
        const response = await api.get(`/supplies/invoice_show/${id}`)

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

const buttons = configButtons({ useGlobalStore, useInvoice, configModal })
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
        <Invoice
            :useInvoice="useInvoice"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>
</template>
