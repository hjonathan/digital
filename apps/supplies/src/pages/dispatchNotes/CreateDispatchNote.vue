<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { configButtons } from './configButtons'
import { Overlay, ConfirmationModal } from 'layout'
import DispatchNote from './DispatchNote.vue'
import { useDispatchNote as useComposable } from './useDispatchNote'
import { inject, onMounted, ref } from 'vue'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'
import moment from 'moment-timezone'
import { configSchema } from './configSchema'
import { formatDate, formatDiffForHumans } from 'shared'

const { t } = useI18n()
const overlay = ref(true)

const router = inject('router')

const id = router.currentRoute.value.params.id

const useGlobalStore = inject('useGlobalStore')
const useDispatchNote = useComposable({ useGlobalStore, create: true, configSchema })

const rapidStore = useGlobalStore('rapidStore')
const parametersStore = useGlobalStore('parameters')

const { data, variables } = useDispatchNote

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderType: router.currentRoute.value.query.supplyOrderType,
    supply_order_parent_id: router.currentRoute.value.query.supplyOrderId,
    processStageDocumentTypeId: router.currentRoute.value.query.processStageDocumentTypeId,
    documentType: router.currentRoute.value.query.documentType
}

onMounted(async () => {
    if (id) {
        const response = await api.get(`supplies/purchase_request_show/${variables.value.supplyOrderId}`)

        const processResponse = await api.get(`/supplies/dispatch_supply_list/${id}`)

        overlay.value = false

        if (response.success) {
            delete response.data.id
            formatData(response.data, processResponse.data)
        }

        if (response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }
})

const formatData = (obj, processSupplies) => {
    data.value = {
        ...obj,
        idRequest: variables.value.supplyOrderId,
        name: obj.request_user.name,
        position: obj.request_user.position,
        email: obj.request_user.email,
        phone: obj.request_user.phone,
        department: obj.request_user.department,
        dateInfo: {
            date: moment(new Date()).format('YYYY-MM-DD')
        },
        note: obj.note,
        requisition_supplies: processSupplies.map(e => {
            return {
                ...e,
                quantity: e.supply_transactions.reduce((acc, value) => {
                    acc += value.quantity
                    return acc
                }, 0),
                name: e.name,
                measure: parametersStore.getItemById(e.measure_id)
            }
        }),
        requester: {
            ...obj.supply_order_approvals[0],
            requester_date: formatDate(obj.requested_date)
        },
        approvals: obj?.supply_order_approvals.map(e => {
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
        }).filter(e => !['requested', 'dispatched'].includes(e.supply_order_approval_status.slug)),
        deliveryInformation: {
            requested_delivery_date: obj?.requested_delivery_date,
            instructions: obj?.instructions ? obj?.instructions : `- ${t('No instructions were provided')} -`
        }
    }
}

const configModal = ref({
    title: null,
    description: null,
    confirmButtonLabel: null,
    confirm: null,
    confirmation: null,
    showAlert: false,
    modelData: ''
})

const buttons = configButtons({ configModal, useDispatchNote, useGlobalStore })
</script>

<template>
    <ConfirmationModal
        :title="configModal.title"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        :show-errors="false"
        class="z-50" />

    <Overlay
        v-if="overlay"
        class="z-50" />

    <DocumentWrapper :buttons="buttons">
        <DispatchNote
            :useDispatchNote="useDispatchNote" />
    </DocumentWrapper>
</template>
