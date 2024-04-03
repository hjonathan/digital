<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import AlertModal from '../../components/alertModal/AlertModal.vue'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'
import { configButtons } from './configButtons'
import { api } from '@/config'

import { useI18n } from 'vue-i18n'

import SalesOrder from './SalesOrder.vue'

import { useSalesOrder as useComposable } from './useSalesOrder'

import { inject, onMounted, ref } from 'vue'

import { Overlay } from 'layout'

const useAlertModal = useComposableModal({})

const useGlobalStore = inject('useGlobalStore')
const overlay = ref(true)

const { t } = useI18n()

const schema = {
    role: 'show',
    shipping_cost: {
        mode: 'readonly',
        show_view: true
    },
    purchase_order: {
        mode: 'readonly'
    }
}

const router = inject('router')

const id = router.currentRoute.value.params.id

const rapidStore = useGlobalStore('rapidStore')

const useAdditionalCosts = useComposableAdditionalCosts()
const useSalesOrder = useComposable({ schema, useAdditionalCosts })

const { setAdditionalCostsSchema } = useAdditionalCosts

const buttons = configButtons({ useAlertModal, useSalesOrder, useGlobalStore })

const { data } = useSalesOrder

onMounted(async () => {
    if (id) {
        const response = await api.get(`/supplies/sales_order_show/${id}`)

        overlay.value = false

        if (response.success) {
            formatData(response.data)
        }

        if (response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }
})

const formatData = (warehouseReceiptData) => {
    data.value = {
        ...warehouseReceiptData,
        ...data.value,
        order_supplies: [warehouseReceiptData?.supply],
        sales_order_number: warehouseReceiptData?.sales_order_number,
        taxes: warehouseReceiptData?.taxes,
        shipping_cost: warehouseReceiptData?.shipping_cost,
        estimated_shipping: warehouseReceiptData?.estimated_shipping,
        handling: warehouseReceiptData?.handling,
        receiver: warehouseReceiptData.request_user ? warehouseReceiptData.request_user : {},
        insurance_cost: warehouseReceiptData?.insurance_cost
    }

    data.value.id = warehouseReceiptData.id

    setAdditionalCostsSchema(data.value)
}
</script>

<template>
    <Overlay
        v-if="overlay"
        class="z-50" />

    <DocumentWrapper
        v-if="!overlay"
        :buttons="buttons">
        <SalesOrder
            :schema="schema"
            :useSalesOrder="useSalesOrder"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>

    <AlertModal
        :useAlertModal="useAlertModal" />
</template>
