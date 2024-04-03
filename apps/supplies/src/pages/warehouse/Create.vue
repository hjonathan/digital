<script setup>
import { inject, onMounted, ref } from 'vue'

import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'

import { configButtons } from './configButtons'

import Warehouse from './Warehouse.vue'

import { useWarehouse as useComposable } from './useWarehouse'

import { ConfirmationModal } from 'layout'
import moment from 'moment-timezone'

const router = inject('router')

const useGlobalStore = inject('useGlobalStore')
const invoiceStore = useGlobalStore('invoice')

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
const useWarehouse = useComposable({ schema: schema.value, useAdditionalCosts })
const { setAdditionalCostsSchema } = useAdditionalCosts

const { data, variables, uniqueItem } = useWarehouse

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
            :schema="schema"
            :useWarehouse="useWarehouse"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>
</template>
