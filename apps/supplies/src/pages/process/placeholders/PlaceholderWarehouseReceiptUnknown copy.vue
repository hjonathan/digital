<script setup>
import PlaceholderCreate from '../PlaceholderCreate.vue'
import { ref, inject } from 'vue'
import { mdiFileDocumentPlusOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const props = defineProps({
    type: Object,
    useProcess: Object
})

const { process, isLoading } = props.useProcess

const onClick = () => {
    tabsStore.openTab({
        name: 'UnknownSuppliesList',
        query: {
            idThread: 'ReceiptUnknown',
            action: 'ReceiptUnknown',
            vendorId: props.type.process_stage_documents[0].supply_order.vendor_id
        }
    })
}

const data = ref({
    label: t('Receipt'),
    description: t('Add warehouse receipt from list'),
    labelButton: t('Add receipt')
})

rapidStore.$registerGlobalEvent('selectedItems:ReceiptUnknown', async (data) => {
    isLoading.value = true

    const response = await api.post('/supplies/process_warehouse_receipt_add', {
        processStageDocumentTypeId: props.type.id,
        processId: process.value.id,
        warehouse_receipt_list: data.map(e => e.id)
    })

    isLoading.value = false

    if (response.success) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

        rapidStore.$emitGlobalEvent('updateSupplyDashboard')
    }

    if (response.errors) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
    }
})

</script>

<template>
    <PlaceholderCreate
        :onClick="onClick"
        :label="data.label"
        :description="data.description"
        :labelButton="data.labelButton"
        :icon="mdiFileDocumentPlusOutline" />
</template>
