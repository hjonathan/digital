import { computed, inject, ref } from 'vue'
import { downloadBase64PDF, round } from 'shared'
import { api } from '@/config'
import { useFormComponent } from 'form'

import axios from 'axios'

export const useWarehouse = ({ schema, useAdditionalCosts }) => {
    const useGlobalStore = inject('useGlobalStore')
    const coreStore = useGlobalStore('core')

    const permissions = coreStore.getPermissions()

    const lockShippingCost = ref(false)

    const variables = ref({})

    const uniqueItem = ref(false)

    const { finalStyles } = useFormComponent()

    const receptionItems = ref([])
    const vendor = ref({})

    const data = ref({
        sales_order_number: null,
        receiver: {
            ...coreStore.credentials?.user
        },
        shipping_cost: 0,
        taxes: 0,
        handling: 0,
        estimated_shipping: 0,
        order_supplies: null
    })

    const errors = ref({})

    const isPrintButtonLoading = ref(false)

    const subTotal = computed(() => {
        let amount = 0

        if (data.value.order_supplies?.supply) {
            for (const item of data.value.order_supplies?.supply) {
                if (item.unit_price && item.quantity) {
                    amount += item.unit_price * item.quantity
                }
            }
        }

        return round(amount)
    })

    const total = computed(() => {
        let amount = 0

        if (data.value.order_supplies?.supply) {
            for (const item of data.value.order_supplies?.supply) {
                if (item.unit_price && item.quantity) {
                    amount += item.unit_price * item.quantity
                }
            }
        }

        amount += useAdditionalCosts.totalAdditionalCosts.value

        return round(amount)
    })

    const formatApiData = () => {
        return {
            vendor_id: vendor?.value?.id,
            supplies_list: receptionItems.value,
            ...variables.value
        }
    }

    const print = async () => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById('WHCPrintableArea')

        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)
/*         const res = await axios.post('http://127.0.0.1:8000/api/pdf/manifest/create', data)

        const response = res.data */

        response.success && downloadBase64PDF(response.data.content, `SuppliesCombination-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    return {
        data,
        schema,
        errors,
        permissions,
        lockShippingCost,
        variables,
        uniqueItem,
        print,
        isPrintButtonLoading,
        subTotal,
        total,
        formatApiData,
        receptionItems,
        vendor
    }
}
