<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import AlertModal from '../../components/alertModal/AlertModal.vue'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import { useAdditionalCosts as useComposableAdditionalCosts } from '../../components/useAdditionalCosts'
import { configButtons } from './configButtons'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'
import Warehouse from './Warehouse.vue'
import { useWarehouse as useComposable } from './useWarehouse'
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
    sales_order: {
        mode: 'readonly'
    }
}

const router = inject('router')

const id = router.currentRoute.value.params.id

const rapidStore = useGlobalStore('rapidStore')
const unknownSuppliesStore = useGlobalStore('unknownSupplies')

const useAdditionalCosts = useComposableAdditionalCosts()
const useWarehouse = useComposable({ schema, useAdditionalCosts })
const { setAdditionalCostsSchema } = useAdditionalCosts
const parametersStore = useGlobalStore('parameters')

const buttons = configButtons({ useAlertModal, useWarehouse, useGlobalStore })

const { data, vendor, receptionItems } = useWarehouse

onMounted(async () => {
    if (id) {
        const response = await api.get(`/supplies/combine_unknown_supply_show/${id}`)
        overlay.value = false

        if (response.success) {
            formatData(response.data)
        }

        if (response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

            return
        }
    
        for (const supply of data?.value?.supply_order_supplies) {
            receptionItems.value.push({
                ...supply,
                measure: parametersStore.getItemById(supply.measure_id),
                location: parametersStore.getItemById(supply.location_id),
                category: parametersStore.getItemById(supply.category_id),
                receptionId: supply.supply_order_id,
                combinedItems: supply.combinedItems,
                selectedCombine: false
            })   
        }
    }
})

const formatData = (warehouseReceiptData) => {
    data.value = {
        ...warehouseReceiptData,
        ...data.value,
    }

    data.value.id = warehouseReceiptData.id

    vendor.value = warehouseReceiptData.vendor

    setAdditionalCostsSchema({ ...data.value })
}
</script>

<template>
    <Overlay
        v-if="overlay"
        class="z-50"/>

    <DocumentWrapper
        :buttons="buttons">
        <Warehouse
            :schema="schema"
            :useWarehouse="useWarehouse"
            :useAdditionalCosts="useAdditionalCosts" />
    </DocumentWrapper>

    <AlertModal
        :useAlertModal="useAlertModal" />
</template>
