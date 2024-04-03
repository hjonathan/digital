<script setup>
import PlaceholderCreate from '../PlaceholderCreate.vue'
import { ref, inject, computed, onMounted } from 'vue'
import { mdiFileDocumentPlusOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
import SvgIcon from '@jamescoyle/vue-icon'
import { Button, ActionButtons, Slideover } from 'layout'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'

import ReceiptSelection from './ReceiptSelection.vue'

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')

const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const props = defineProps({
    type: Object,
    useProcess: Object
})

const show = ref(false)

const receipts = ref([])

const { process, isLoading } = props.useProcess

const slideoverConfig = ref({
    open: false,
    close: false
})

const onClick = () => {
    tabsStore.openTab({
        name: 'UnknownSuppliesList',
        query: {
            idThread: 'ReceiptUnknown',
            action: 'ReceiptUnknown',
            vendorId: invoice.value.supply_order.vendor_id
        }
    })
}

const data = ref({
    label: t('Receive in warehouse'),
    description: t('Add new receipt or add from an existing list'),
    labelButton: t('New receipt')
})

// rapidStore.$registerGlobalEvent('selectedItems:ReceiptUnknown', async (data) => {
//     isLoading.value = true

//     const response = await api.post('/supplies/process_warehouse_receipt_add', {
//         processStageDocumentTypeId: props.type.id,
//         processId: process.value.id,
//         warehouse_receipt_list: data.map(e => e.id)
//     })

//     isLoading.value = false

//     if (response.success) {
//         rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

//         rapidStore.$emitGlobalEvent('updateSupplyDashboard')
//     }

//     if (response.errors) {
//         rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
//     }
// })

rapidStore.$registerGlobalEvent('selectedItems:ReceiptUnknown', async (data) => {
    receipts.value = data

    show.value = true
    slideoverConfig.value.open = !slideoverConfig.value.open

    // isLoading.value = true

    // const response = await api.post('/supplies/process_warehouse_receipt_add', {
    //     processStageDocumentTypeId: props.type.id,
    //     processId: process.value.id,
    //     warehouse_receipt_list: data.map(e => e.id)
    // })

    // isLoading.value = false

    // if (response.success) {
    //     rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

    //     rapidStore.$emitGlobalEvent('updateSupplyDashboard')
    // }

    // if (response.errors) {
    //     rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
    // }
})

const onClickNew = () => {
    const query = {
        stageId: props.type.process_stage_id,
        processId: process.value.id,
        supplyOrderType: props.type.slug,
        supplyOrderId: invoice.value.supply_order_id,
        processStageDocumentTypeId: props.type.id
    }

    tabsStore.openTab({ name: 'CreateWarehouseReceipt', query })
}

const cancel = () => {
    show.value = false
}

const getDocumentType = (process, type) => {
    let document

    for (const stage of process.process_stages) {
        const res = stage.process_stage_document_types.find(e => e.slug === type)

        if (res) {
            document = res

            break
        }
    }

    return document
}

const invoice = computed(() => {
    return getDocumentType(process.value, 'invoice').process_stage_documents[0]
})

</script>

<template>
    <div class="group flex flex-col justify-center items-center h-60 border-dashed border-4 w-full border-gray-300 space-y-5 rounded-lg">
        <div class="text-center">
            <span
                class="inline-flex h-12 w-12 items-center rounded-full border-1 justify-center bg-gray-300 text-white " >
                <svg-icon
                    type="mdi"
                    :path="mdiFileDocumentPlusOutline"
                    size="32" />
            </span>

            <h3 class="mt-2 text-sm font-semibold text-gray-900">
                {{ data.label }}
            </h3>

            <p class="mt-1 text-sm text-gray-500">
                {{ data.description }}
            </p>

            <div class="flex flex-row items-center justify-center space-x-8 pt-4 w-full">
                <Button
                    class="!px-0 opacity-90 hover:opacity-100"
                    :label="data.labelButton"
                    size="sm"
                    color="primary"
                    @click="onClickNew" />

                <span class="text-sm">{{ t('or') }}</span>

                <Button
                    class="!px-0 opacity-90 hover:opacity-100"
                    :label="t('From list')"
                    size="sm"
                    color="primary"
                    @click="onClick" />
            </div>
        </div>
    </div>

    <Slideover
        :title="'Receipts selections'"
        :id="null"
        has-cancel-button
        has-save-button
        :open="slideoverConfig.open"
        :close="slideoverConfig.close"
        @clickOnSave="onSave" >
            <ReceiptSelection :receipts="receipts" :invoice="invoice" :type="type" :useProcess="useProcess" @on-save="cancel"/>
    </Slideover>
</template>
