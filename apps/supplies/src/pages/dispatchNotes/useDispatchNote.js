import { ref, computed } from 'vue'
import moment from 'moment-timezone'
import { downloadBase64PDF } from 'shared'
import { api } from '@/config'
import { useFormComponent } from 'form'

import { useI18n } from 'vue-i18n'

import axios from 'axios'

export const useDispatchNote = ({ useGlobalStore, create = false, configSchema }) => {
    const coreStore = useGlobalStore('core')
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')
    const rapidStore = useGlobalStore('rapidStore')
    const processStore = useGlobalStore('process')
    const dispatchNotesStore = useGlobalStore('dispatchNotes')
    const suppliesCostStore = useGlobalStore('suppliesCost')
    const suppliesTransactionStore = useGlobalStore('suppliesTransaction')

    const permissions = coreStore.getPermissions()

    const { finalStyles } = useFormComponent()

    const isPrintButtonLoading = ref(false)

    const type = ref('purchase-request')

    const data = ref({
        dateInfo: {
            date: moment(new Date()).format('YYYY-MM-DD')
        },
        note: '',
        deliveryInformation: {},
        requisition_supplies: [{}],
        approvalStatus: {},
        finalApprovalStatus: {}
    })

    const variables = ref({
        stageId: null,
        processId: null,
        supplyOrderId: null,
        supplyOrderTypeId: null
    })

    const sync = () => {
        dispatchNotesStore.fetch()
        processStore.fetch()
        suppliesCostStore.fetch()
        suppliesTransactionStore.fetch()

        rapidStore.$emitGlobalEvent('updateSupplyDashboard')
    }

    const schema = computed(() => {
        return configSchema({
            useGlobalStore,
            data: {
                id: data.value.id,
                useGlobalStore,
                approval_user_id: data.value.approval_user_id,
                supply_order_status: data.value.supply_order_status,
                request_area_id: data.value.request_area_id,
                ...data.value
            },
            create
        })
    })

    const dispatchNote = async () => {
        const response = await api.post('/supplies/dispatch_note_build', {
            id: data.value.id,
            approval: true,
            dispatch_supplies: data.value.requisition_supplies.map(e => {
                return {
                    supply_id: e.id || e.supply_id,
                    name: e.name,
                    quantity: e.quantity,
                    measure_id: e.measure_id,
                    custom_product: true
                }
            }),
            ...variables.value
        })

        if (response.success) {
            type.value === 'material-request' && tabsStore.closeTab('CreateDispatchNoteMR')

            type.value === 'purchase-request' && tabsStore.closeTab('CreateDispatchNote')

            type.value === 'material-assignment' && tabsStore.closeTab('CreateDispatchNoteMA')

            sync()
        }

        if (response.errors || !response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

            sync()

            errors.value = response.errors

            return {
                errors: {
                    message: t(response.message)
                }
            }
        }
    }

    const dispatchNoteDelivery = async ({ approval, note }) => {
        const response = await api.post('/supplies/dispatch_note_receive', {
            id: data.value.id,
            approval,
            note_dispatch_approval_or_reject: note,
            ...variables.value
        })

        sync()

        if (response.success) {
            type.value === 'material-assignment' && tabsStore.closeTab('ShowDispatchNoteMA')

            tabsStore.closeTab('ShowDispatchNote')
        }

        if (!response.success || response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

            errors.value = response.errors

            if (response.errors?.note_dispatch_approval_or_reject) {
                return {
                    errors: {
                        message: t(response.message)
                    }
                }
            }
        }
    }

    const print = async (element = 'MRPrintableArea') => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById(element)

        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)
/*         const res = await axios.post('http://127.0.0.1:8000/api/pdf/manifest/create', data)

        const response = res.data */

        response.success && downloadBase64PDF(response.data.content, `DN-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    const errors = ref({})

    return {
        data,
        schema,
        errors,
        variables,
        type,
        permissions,
        dispatchNote,
        dispatchNoteDelivery,
        print,
        isPrintButtonLoading
    }
}
