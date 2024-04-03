<script setup>
import { ref, inject, shallowRef, computed } from 'vue'
import CardDocument from '../CardDocument.vue'
import { useI18n } from 'vue-i18n'
import { mdiTrashCanOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { formatDate, showUuid } from 'shared'
import { api } from '@/config'
import { WarehouseReceiptModal } from '../modals/index'
import { getDocumentType } from '../configProcess'

const { t } = useI18n()

const props = defineProps({
    document: Object,
    useProcess: Object
})

const { process, isLoading, configModal } = props.useProcess

const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')

const title = ref(t('Receipt unknown') + ` ${showUuid(props.document.supply_order_id)} `)

const enableRemove = computed(() => {
    const response = process.value.process_stages.find(e => e.id === props.document.process_stage_document_type_id)

    const documentType = getDocumentType(process.value, 'warehouse-receipt-unknown-supply')

    return (response && response.active === 1) && documentType && documentType.process_stage_documents.length > 1
})

const data = ref([
    {
        label: t('Request user'),
        value: props.document.supply_order.request_user.name
    },
    {
        label: t('Vendor'),
        value: props.document.supply_order.vendor?.name
    },
    {
        label: t('Requested date'),
        value: formatDate(props.document.supply_order.requested_date)
    },
    // {
    //     label: t('Status'),
    //     type: 'badge',
    //     options: {
    //         color: getStatusColor(document.supply_order.supply_order_status.slug)
    //     },
    //     value: document.supply_order.supply_order_status.name
    // },
    // document.supply_order_approvals.length && {
    //     label: t('Approvals history'),
    //     type: 'history',
    //     options: {
    //         open: !!document.supply_order_approvals?.find(e => e.approval == null)
    //     },
    //     value: buildApprovalHistory(process, type, document)
    // },
])

const onClick = () => {
    tabsStore.openTab({ name: 'ShowReceipt', params: { id: props.document.supply_order_id } })
}

const onRemove = async () => {
    configModal.value.template = 'cancelProcess'

    configModal.value.confirmation = async ({ note }) => {
        isLoading.value = true

        const response = await api.post('/supplies/process_warehouse_receipt_remove', {
            processStageDocumentTypeId: props.document.process_stage_document_type_id,
            processId: process.value.id,
            supply_order_id: props.document.supply_order_id
        })

        isLoading.value = false

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

            rapidStore.$emitGlobalEvent('updateSupplyDashboard')
        }

        if (response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }

    configModal.value.title = t('Confirmation')
    configModal.value.description = t('The reception will be removed from the list. Are you sure to remove the receipt?')
    configModal.value.confirmButtonLabel = t('Remove')
    configModal.value.note = false
    configModal.value.type = 'danger'
    configModal.value.component = shallowRef(WarehouseReceiptModal)

    configModal.value.showAlert = true
}

</script>
<template>
    <div>
        <CardDocument
            :title="title"
            v-model:data="data"
            @click="onClick">
            <template #footer v-if="enableRemove">
                <div class="flex flex-row-reverse py-3 px-3">
                    <svg-icon
                        @click.stop="onRemove"
                        :path="mdiTrashCanOutline"
                        type="mdi"
                        size="20"
                        class="hover:text-red-500"/>
                </div>
            </template>
        </CardDocument>
    </div>
</template>
<styles>
</styles>
