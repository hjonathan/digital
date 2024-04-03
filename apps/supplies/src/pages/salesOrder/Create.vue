<script setup>
import { inject, onMounted, ref } from 'vue'

import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'

import { configButtons } from './configButtons'

import SalesOrder from './SalesOrder.vue'

import { ConfirmationModal } from 'layout'

import { useSalesOrder as useComposable } from './useSalesOrder'
import moment from 'moment-timezone'

const router = inject('router')

const useAlertModal = useComposableModal({})
const useGlobalStore = inject('useGlobalStore')
const purchaseOrderStore = useGlobalStore('purchaseOrder')

const schema = ref({
    role: 'creator',
    shipping_cost: {
        mode: 'edit',
        show_view: false
    },
    purchase_order: {
        mode: 'edit'
    }
})

const useAdditionalCosts = useComposableAdditionalCosts()
const useSalesOrder = useComposable({ schema: schema.value, useAdditionalCosts })

const { data, variables, uniqueItem } = useSalesOrder
const { setAdditionalCostsSchema } = useAdditionalCosts

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderType: router.currentRoute.value.query.supplyOrderType,
    processStageDocumentTypeId: router.currentRoute.value.query.processStageDocumentTypeId,
    documentType: router.currentRoute.value.query.documentType
}

onMounted(async () => {
    setAdditionalCostsSchema(data.value)

    data.value.order_supplies = variables.value.supplyOrderId ? null : []

    if (variables.value.supplyOrderId) {
        uniqueItem.value = true

        schema.value.shipping_cost.mode = uniqueItem.value ? 'readonly' : 'edit'

        const response = await purchaseOrderStore.fetchRequestById(variables.value.supplyOrderId)

        if (!response.vendor) response.vendor = {}

        data.value.order_supplies = response

        data.value.receiver.reception_date = moment(new Date()).format('DD/MM/YYYY')

        setAdditionalCostsSchema({ ...response, id: data.value?.id })
    }
})

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const buttons = configButtons({ configModal, useSalesOrder, useGlobalStore })
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
        <SalesOrder
            :schema="schema"
            :useSalesOrder="useSalesOrder"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>
</template>
