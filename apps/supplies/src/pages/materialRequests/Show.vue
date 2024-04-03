<script setup>
import DocumentWrapper from '../../components/DocumentWrapper.vue'
import { configButtons } from './configButtons'
import { Overlay } from 'layout'
import MaterialRequest from './MaterialRequest.vue'
import { useMaterialRequest as useComposable } from './useMaterialRequest'
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
const useMaterialRequest = useComposable({ useGlobalStore, configSchema })

const rapidStore = useGlobalStore('rapidStore')
const parametersStore = useGlobalStore('parameters')
const suppliesStore = useGlobalStore('supplies')

const { data, variables } = useMaterialRequest

variables.value = {
    stageId: router.currentRoute.value.query.stageId,
    processId: router.currentRoute.value.query.processId,
    supplyOrderId: router.currentRoute.value.query.supplyOrderId,
    supplyOrderType: router.currentRoute.value.query.supplyOrderType
}

onMounted(async () => {
    if (id) {
        const response = await api.get(`supplies/material_request_show/${id}`)

        overlay.value = false

        if (response.success) {
            formatData(response.data)
        }

        if (response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }
})

const formatData = (obj) => {
    data.value = {
        ...obj,
        name: obj.request_user.name,
        position: obj.request_user.position,
        email: obj.request_user.email,
        phone: obj.request_user.phone,
        department: obj.request_user.department,
        dateInfo: {
            date: moment(new Date()).format('YYYY-MM-DD')
        },
        note: obj.note,
        requisition_supplies: obj.supply.map(e => {
            return {
                ...e,
                supply: e.custom_product ? e.name : suppliesStore.getItemById(e.supply_id),
                custom_product: e.custom_product == 1,
                measure: parametersStore.getItemById(e.measure_id)
            }
        }),
        requester: {
            ...obj.supply_order_approvals[0],
            requester_date: formatDate(obj.updated_at)
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
            requested_delivery_date: obj?.requested_delivery_date ? formatDate(obj?.requested_delivery_date) : null,
            instructions: obj?.instructions ? obj?.instructions : `- ${t('No instructions were provided')} -`
        }
    }
}

suppliesStore.fetch()

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

const buttons = configButtons({ configModal, useMaterialRequest, useGlobalStore })
</script>

<template>
    <!-- Confirmation Modal -->
    <Component
        :is="configModal.component"
        :config="configModal"
        :show-errors="false" />

    <Overlay
        v-if="overlay"
        class="z-50"/>

    <DocumentWrapper :buttons="buttons">
        <MaterialRequest
            :useMaterialRequest="useMaterialRequest" />
    </DocumentWrapper>
</template>
