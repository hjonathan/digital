import { ref, computed } from 'vue'
import moment from 'moment-timezone'
import { downloadBase64PDF, formatDate } from 'shared'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
import { useFormComponent } from 'form'

import axios from 'axios'

export const useSupplyAdjustment = ({ useGlobalStore, create = false, configSchema }) => {
    const { t } = useI18n()

    const coreStore = useGlobalStore('core')
    const supplyAdjustmentStore = useGlobalStore('supplyAdjustment')
    const suppliesStore = useGlobalStore('supplies')
    const suppliesCostStore = useGlobalStore('suppliesCost')
    const tabsStore = useGlobalStore('tabs')
    const rapidStore = useGlobalStore('rapidStore')

    const permissions = coreStore.getPermissions()

    const { finalStyles } = useFormComponent()

    const data = ref({
        register_date: formatDate(moment()),
        adjustment_reason: '',
        supply_id: null,
        adjust_supplies: []
    })

    const variables = ref({
        stageId: null,
        processId: null,
        supplyOrderId: null,
        supplyOrderTypeId: null
    })

    const configModal = ref({
        title: null,
        type: null,
        description: null,
        confirmButtonLabel: null,
        confirm: null,
        confirmation: null,
        showAlert: false,
        modelData: {}
    })

    const schema = computed(() => {
        return configSchema({
            useGlobalStore,
            data: {
                id: data.value.id,
                approval_user_id: data.value.approval_user_id,
                editable: data.value.editable,
                supply_order_status: data.value.supply_order_status,
                ...data.value
            },
            create
        })
    })

    const errors = ref({})

    const isPrintButtonLoading = ref(false)

    const syncTabs = () => {
        supplyAdjustmentStore.fetch()

        suppliesCostStore.fetch()

        suppliesStore.fetch()
    }

    const approve = async (note) => {
        const response = await api.post('/supplies/adjutment_change_status', {
            id: data.value.id,
            approval: true,
            note_approval_or_reject: note
        })

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

            syncTabs()

            tabsStore.closeTab('ShowSupplyAdjustment')
        }

        return response
    }

    const reject = async (note) => {
        const response = await api.post('/supplies/adjutment_change_status', {
            id: data.value.id,
            approval: false,
            note_approval_or_reject: note
        })

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

            syncTabs()

            tabsStore.closeTab('ShowSupplyAdjustment')
        }

        return response
    }

    const formatApiData = () => {
        return {
            adjustment_reason: data.value.adjustment_reason,
            supply_id: data.value.supply?.id,
            adjust_supplies: data.value.adjust_supplies.map(transaction => ({
                transaction_id: transaction.transaction_id || 0,
                supply_transaction_id: transaction.supply_trnasaction_id || 0,
                measure_id: transaction.measure_id,
                quantity: transaction.quantity,
                cost: transaction.cost,
                original_quantity: transaction.original_quantity,
                original_cost: transaction.original_cost,
                supply_action: transaction.supply_action || null
            }))
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

        const response = res.data
 */
        response.success && downloadBase64PDF(response.data.content, `Adjust-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    return {
        data,
        schema,
        errors,
        variables,
        permissions,
        isPrintButtonLoading,
        configModal,
        print,
        formatApiData,
        syncTabs,
        approve,
        reject
    }
}
