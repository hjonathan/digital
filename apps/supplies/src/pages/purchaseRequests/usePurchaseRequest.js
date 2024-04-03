import { inject, ref, computed } from 'vue'
import moment from 'moment-timezone'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'
import { formatDate, downloadBase64PDF } from 'shared'
import { useFormComponent } from 'form'

import axios from 'axios'

export const usePurchaseRequest = ({ configSchema, create }) => {
    const { t } = useI18n()
    const useGlobalStore = inject('useGlobalStore')
    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')
    const purchaseRequestStore = useGlobalStore('purchaseRequest')
    const processStore = useGlobalStore('process')
    const coreStore = useGlobalStore('core')

    const { finalStyles } = useFormComponent()

    const permissions = coreStore.getPermissions()

    const data = ref({
        name: '',
        position: '',
        email: '',
        phone: '',
        department: '',
        request_date: {
            date: moment(new Date()).format('YYYY-MM-DD')
        },
        note: '',
        deliveryInformation: {},
        request_item: [{
            quantity: 1
        }]
    })

    const variables = ref({
        stageId: null,
        processId: null,
        supplyOrderId: null,
        supplyOrderTypeId: null
    })

    const errors = ref({})

    const syncStores = () => {
        purchaseRequestStore.fetch()

        processStore.fetch()
    }

    const schema = computed(() => {
        return configSchema({
            useGlobalStore,
            id: data.value.id,
            status: data.value.supply_order_status,
            approval_user_id: data.value.approval_user_id,
            editable: data.value.editable,
            supply_order_status: data.value.supply_order_status,
            process: data.value.process
        })
    })

    const formatApiData = () => {
        const apiData = {
            note: data.value.note,
            company_name: data.value.deliveryInformation?.company_name,
            name: data.value.deliveryInformation?.name,
            address: data.value.deliveryInformation?.address,
            address_2: data.value.deliveryInformation?.address_2,
            zip_code: data.value.deliveryInformation?.zip_code,
            phone: data.value.deliveryInformation?.phone,
            city: data.value.deliveryInformation?.city,
            state: data.value.deliveryInformation?.state,
            requested_date: data.value.requester?.requested_date ? formatDate(data.value.requester?.requested_date, 'utcDateTime') : null,
            requested_delivery_date: data.value.deliveryInformation?.requested_delivery_date ? formatDate(data.value.deliveryInformation?.requested_delivery_date, 'utcDateTime') : null,
            instructions: data.value.deliveryInformation?.instructions,
            request_item: [
                {
                    measure_id: data.value.request_item[0]?.measure_id,
                    name: data.value.request_item[0]?.name,
                    description: data.value.request_item[0]?.description,
                    sku_part_number: data.value.request_item[0]?.sku_part_number,
                    category: data.value.request_item[0]?.category,
                    brand: data.value.request_item[0]?.brand,
                    accounting_number: data.value.request_item[0]?.accounting_number,
                    vendor_information: data.value.request_item[0]?.vendor_information,
                    justification: data.value.request_item[0]?.justification,
                    budget_information: data.value.request_item[0]?.budget_information,
                    price: data.value.request_item[0]?.price,
                    quantity: data.value.request_item[0]?.quantity
                },
            ],
            ...variables.value
        }

        return apiData
    }

    const send = async () => {
        errors.value = {}

        const apiData = formatApiData()

        const response = await api.post('/supplies/purchase_request_build', apiData)

        if (response.errors || !response.success || response.exception) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

            errors.value = response.errors
        }

        if (!response.errors) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

            syncStores()

            tabsStore.closeTab('CreatePurchaseRequest')
        }
    }

    const sendPurchaseRequestManager = async ({ note, approval }) => {
        const response = await api.post('/supplies/purchase_request_change_status', {
            id: data.value.id,
            approval,
            note_approval_or_reject: note.value,
            ...variables.value
        })

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

            rapidStore.$emitGlobalEvent('updateSupplyDashboard')

            syncStores()

            tabsStore.closeTab('ShowPurchaseRequest')
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

    const isPrintButtonLoading = ref(false)

    const print = async () => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById('PRPrintableArea')

        // const data = { data: printableArea.innerHTML }
        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)
/*         const res = await axios.post('http://127.0.0.1:8000/api/pdf/manifest/create', data)

        const response = res.data
 */
        response.success && downloadBase64PDF(response.data.content, `PR-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    return {
        data,
        schema,
        errors,
        send,
        sendPurchaseRequestManager,
        permissions,
        print,
        isPrintButtonLoading,
        variables
    }
}
