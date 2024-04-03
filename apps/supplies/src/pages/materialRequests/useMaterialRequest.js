import { ref, computed } from 'vue'
import moment from 'moment-timezone'
import { downloadBase64PDF } from 'shared'
import { api } from '@/config'

import { useFormComponent } from 'form'

import axios from 'axios'

export const useMaterialRequest = ({ useGlobalStore, create = false, configSchema }) => {
    const coreStore = useGlobalStore('core')

    const permissions = coreStore.getPermissions()

    const { finalStyles } = useFormComponent()

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

    const schema = computed(() => {
        return configSchema({
            useGlobalStore,
            data: {
                id: data.value.id,
                approval_user_id: data.value.approval_user_id,
                editable: data.value.editable,
                supply_order_status: data.value.supply_order_status,
                process: data.value.process
            },
            create
        })
    })

    const errors = ref({})

    const isPrintButtonLoading = ref(false)

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

        response.success && downloadBase64PDF(response.data.content, `MR-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    return {
        data,
        schema,
        errors,
        variables,
        permissions,
        print,
        isPrintButtonLoading
    }
}
