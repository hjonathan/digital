import { inject, ref, computed } from 'vue'
import moment from 'moment-timezone'
import { api } from '@/config'
import { downloadBase64PDF, formatDate } from 'shared'
import { useI18n } from 'vue-i18n'
import { useFormComponent } from 'form'

import axios from 'axios'

const CUSTOM_SUPPLY_ID = '4fe13238-cus1-16f3-b184-b772fabf2zzz'

export const useRequestForQuotation = () => {
    const { t } = useI18n()

    const useGlobalStore = inject('useGlobalStore')
    const coreStore = useGlobalStore('core')
    const tabsStore = useGlobalStore('tabs')
    const rapidStore = useGlobalStore('rapidStore')
    const quotationRequestStore = useGlobalStore('quotationRequest')
    const processStore = useGlobalStore('process')

    const { finalStyles } = useFormComponent()

    const permissions = coreStore.getPermissions()

    const variables = ref({})

    const uniqueItem = ref(false)

    const data = ref({
        name: '',
        position: '',
        email: '',
        phone: '',
        department: '',
        dateInfo: {
            date: moment(new Date()).format('YYYY-MM-DD')
        },
        note: '',
        facility: {},
        delivery_information: {},
        requisition_supplies: [{}],
        vendors: [{}],
        send_mail: false,
        send_copy_mail: false
    })

    const errors = ref({})

    const schema = computed(() => {
        return {
            contactInformation: { mode: 'readonly' },
            materialDetails: { mode: !data.value?.id ? 'edit' : 'readonly' },
            termsConditions: { mode: !data.value?.id ? 'edit' : 'readonly' },
            evaluationCriteria: { mode: !data.value?.id ? 'edit' : 'readonly' },
            deliveryInformation: { mode: !data.value?.id ? 'edit' : 'readonly' },
            submissionDetails: { mode: !data.value?.id ? 'edit' : 'readonly' }
        }
    })

    const syncStores = () => {
        quotationRequestStore.fetch()

        processStore.fetch()

        rapidStore.$emitGlobalEvent('updateSupplyDashboard')
    }

    const send = async () => {
        errors.value = {}

        const apiData = formatApiData()

        const response = await api.post('/supplies/request_quotation_build', apiData)

        if (response.errors || !response.success || response.exception) {
            errors.value = response.errors

            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

            /*             return {
                errors: {
                    message: t(response.message)
                }
            } */
        }

        if (!response.errors) {
            syncStores()

            tabsStore.closeTab('CreateRequestForQuotation')
        }
    }

    const formatApiData = () => {
        const apiData = {
            submit_name: data.value.submit_name,
            submit_email: data.value.submit_email,
            submit_date: data.value.submit_date ? formatDate(data.value.submit_date, 'utcDateTime') : null,
            company_name: data.value.delivery_information.company_name,
            name: data.value.delivery_information.name,
            address: data.value.delivery_information.address,
            address_2: data.value.delivery_information.address_2,
            zip_code: data.value.delivery_information.zip_code,
            phone: data.value.delivery_information.phone,
            city: data.value.delivery_information.city,
            state: data.value.delivery_information.state,
            // requested_delivery_date: formatDate(data.value.delivery_information.requested_delivery_date, 'utcDateTime'),
            requested_date: data.value.requested_date ? formatDate(data.value.requested_date, 'utcDateTime') : null,
            requested_delivery_date: data.value.delivery_information?.requested_delivery_date ? formatDate(data.value.delivery_information.requested_delivery_date, 'utcDateTime') : null,
            instructions: data.value.delivery_information.instructions,

            evaluation_criteria: data.value.evaluation_criteria,
            terms_conditions: data.value.terms_conditions,
            requisition_supplies: data.value.requisition_supplies.map((supply) => ({
                supply_id: CUSTOM_SUPPLY_ID,
                name: supply.name,
                measure_id: supply.measure_id,
                custom_product: true,
                quantity: supply.quantity
            })),
            send_mail: data.value.send_mail,
            send_copy_mail: data.value.send_copy_mail,
            requisition_vendors: data.value.vendors.map(item => item?.vendor?.id),
            ...variables.value
        }

        return apiData
    }

    const isPrintButtonLoading = ref(false)

    const print = async () => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById('RFQPrintableArea')

        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)
/*         const res = await axios.post('http://127.0.0.1:8000/api/pdf/manifest/create', data)
        const response = res.data */

        response.success && downloadBase64PDF(response.data.content, `RFQ-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    return {
        data,
        schema,
        errors,
        variables,
        print,
        send,
        permissions,
        isPrintButtonLoading,
        uniqueItem
    }
}
