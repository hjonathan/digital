import { computed, inject, ref } from 'vue'
import moment from 'moment-timezone'
import { api } from '@/config'
import { round, downloadBase64PDF, formatDate } from 'shared'
import { useI18n } from 'vue-i18n'
import { useFormComponent } from 'form'

import axios from 'axios'

const CUSTOM_SUPPLY_ID = '4fe13238-cus1-16f3-b184-b772fabf2zzz'

// Important: Additional costs is an Independent composable inside composable
export const usePurchaseOrder = ({ configSchema, useAdditionalCosts }) => {
    const { t } = useI18n()
    const useGlobalStore = inject('useGlobalStore')
    const coreStore = useGlobalStore('core')

    const tabsStore = useGlobalStore('tabs')
    const rapidStore = useGlobalStore('rapidStore')
    const processStore = useGlobalStore('process')

    const purchaseOrderStore = useGlobalStore('purchaseOrders')

    const permissions = coreStore.getPermissions()

    const variables = ref({})

    const uniqueItem = ref(false)

    const { finalStyles } = useFormComponent()

    const data = ref({
        name: '',
        position: '',
        email: '',
        phone: '',
        department: '',
        purchase_request_id: '',
        request_date: {
            date: moment(new Date()).format('DD/MM/YYYY')
        },
        note: '',
        delivery_information: '',
        shipping_cost: 0,
        taxes: 0,
        handling: 0,
        estimated_shipping: 0,
        requisition_supplies: [{}]
    })

    const errors = ref({})

    const schema = computed(() => {
        return configSchema({
            useGlobalStore,
            id: data.value.id,
            status: data.value.supply_order_status,
            approval_user_id: data.value.approval_user_id,
            editable: data.value.editable,
            supply_order_status: data.value.supply_order_status,
            ...data.value
        })
    })

    const syncStores = () => {
        processStore.fetch()

        purchaseOrderStore.fetchOrders()
    }

    const formatApiData = () => {
        const apiData = {
            requested_date: formatDate(data.value.request_date?.date, 'utcDateTime'),
            document_number: data.value.document_number,
            billing_payment_terms: data.value.billing_payment_terms,
            delivery_information: data.value.delivery_information,
            terms_conditions: data.value.terms_conditions,
            vendor_id: data.value.quotation?.vendor_id,
            supply_quotation_id: data.value.quotation?.supply_quotation_id,
            requisition_supplies: data.value.requisition_supplies.map(item => ({
                item_id: item.item_id,
                custom_product: item.custom_product,
                measure_id: item.measure_id,
                name: item.name,
                quantity: item.quantity,
                quotation_id: item.quotation_id,
                supply_id: item.supply_id,
                unit_price: item.unit_price
            })),
            ...variables.value,
            ...useAdditionalCosts.additionalCosts.value
        }

        return apiData
    }

    const send = async () => {
        errors.value = {}

        const apiData = formatApiData()

        const response = await api.post('/supplies/purchase_order_build', apiData)

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

            syncStores()

            rapidStore.$emitGlobalEvent('updateSupplyDashboard')

            tabsStore.closeTab('CreatePurchaseOrder')

            return
        }

        if (response.errors || !response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

            errors.value = response.errors
        }
    }

    const sendPurchaseOrderManager = async ({ note, approval }) => {
        const response = await api.post('/supplies/purchase_order_change_status', {
            id: data.value.id,
            approval,
            note_approval_or_reject: note.value,
            ...variables.value
        })

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

            syncStores()

            rapidStore.$emitGlobalEvent('updateSupplyDashboard')

            tabsStore.closeTab('ShowPurchaseOrder')
        }

        if (response.errors || !response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

            errors.value = response.errors

            if (response.errors?.note_approval_or_reject) {
                return {
                    errors: {
                        message: t(response.message)
                    }
                }
            }
        }
    }

    const subTotal = computed(() => {
        let amount = 0

        for (const item of data.value.requisition_supplies) {
            if (item.unit_price && item.quantity) {
                amount += item.unit_price * item.quantity
            }
        }

        return round(amount)
    })

    const total = computed(() => {
        let amount = 0

        for (const item of data.value.requisition_supplies) {
            if (item.unit_price && item.quantity) {
                amount += item.unit_price * item.quantity
            }
        }

        amount += useAdditionalCosts.totalAdditionalCosts?.value

        return round(amount)
    })

    const isPrintButtonLoading = ref(false)

    const print = async () => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById('POPrintableArea')

        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)
/*         const res = await axios.post('http://127.0.0.1:8000/api/pdf/manifest/create', data)

        const response = res.data */

        response.success && downloadBase64PDF(response.data.content, `PO-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    return {
        data,
        schema,
        errors,
        send,
        subTotal,
        total,
        sendPurchaseOrderManager,
        variables,
        permissions,
        uniqueItem,
        print,
        isPrintButtonLoading
    }
}
