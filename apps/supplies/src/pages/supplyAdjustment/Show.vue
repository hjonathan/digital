<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { useAlertModal as useComposableModal } from '../../components/alertModal/useAlertModal'
import { configButtons } from './configButtons'
import { Overlay, ConfirmationModal } from 'layout'
import supplyAdjustment from './supplyAdjustment.vue'
import { useSupplyAdjustment as useComposable } from './useSupplyAdjustment'
import { computed, inject, onMounted, ref } from 'vue'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'
import moment from 'moment-timezone'
import { configSchema } from './configSchema'
import { formatDate, formatDiffForHumans } from 'shared'

const { t } = useI18n()
const overlay = ref(true)

const router = inject('router')

const id = router.currentRoute.value.params.id

const useAlertModal = useComposableModal({})

const useGlobalStore = inject('useGlobalStore')
const useSupplyAdjustment = useComposable({ useGlobalStore, configSchema })

const rapidStore = useGlobalStore('rapidStore')
const supplyAdjustmentStore = useGlobalStore('supplyAdjustment')
const suppliesStore = useGlobalStore('supplies')

const { data, variables, configModal } = useSupplyAdjustment

const buttons = configButtons({ useAlertModal, useSupplyAdjustment, useGlobalStore, configModal })

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderType: router.currentRoute.value.query.supplyOrderType
}

onMounted(async () => {
    if (id) {
        const response = await supplyAdjustmentStore.fetchRequestById(id)

        overlay.value = false

        await formatData(response)

        if (response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }
})

const formatData = async (obj) => {
    data.value = {
        ...obj,
        register_date: formatDate(obj.created_at),
        supply: computed(() => {
            return obj.supply[0] ? suppliesStore.getItemById(obj.supply[0].supply_id) : {}
        }),
        adjust_supplies: obj.supply.map(transaction => ({
            ...transaction,
            cost: transaction.unit_price
        })),
        name: obj.request_user.name,
        position: obj.request_user.position,
        email: obj.request_user.email,
        phone: obj.request_user.phone,
        department: obj.request_user.department,
        note: obj.note,
        requester: {
            approval_name: obj.request_user.name,
            approval_position: obj.request_user.position,
            approval_email: obj.request_user.email,
            approval_phone: obj.request_user.phone,
            approval_department: obj.request_user.department
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
        }).filter(e => !['requested', 'dispatched'].includes(e.supply_order_approval_status.slug))
    }
}

suppliesStore.fetch()
</script>

<template>
    <Overlay
        v-if="overlay"
        class="z-50"/>

    <ConfirmationModal
        :title="configModal.title"
        :type="configModal.type"
        :note="configModal.note"
        :description="configModal.description"
        v-model="configModal.showAlert"
        :link-cancel-button="true"
        :confirmation="configModal.confirmation"
        :confirmation-button-label="configModal.confirmButtonLabel"
        class="z-50" />

    <DocumentWrapper :buttons="buttons">
        <supplyAdjustment
            :useSupplyAdjustment="useSupplyAdjustment" />
    </DocumentWrapper>
</template>
