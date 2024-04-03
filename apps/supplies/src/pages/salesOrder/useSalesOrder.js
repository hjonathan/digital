import { computed, inject, ref } from 'vue'
import { api } from '@/config'
import { downloadBase64PDF, round } from 'shared'
import { useFormComponent } from 'form'

import axios from 'axios'

const CUSTOM_SUPPLY_ID = '4fe13238-cus1-16f3-b184-b772fabf2zzz'

export const useSalesOrder = ({ schema, useAdditionalCosts }) => {
    const useGlobalStore = inject('useGlobalStore')
    const coreStore = useGlobalStore('core')

    const permissions = coreStore.getPermissions()

    const lockShippingCost = ref(false)

    const variables = ref({})

    const uniqueItem = ref(false)

    const { finalStyles } = useFormComponent()

    const data = ref({
        sales_order_number: null,
        shipping_cost: 0,
        taxes: 0,
        handling: 0,
        estimated_shipping: 0,
        receiver: {
            ...coreStore.credentials?.user
        },
        order_supplies: []
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

    const print = async () => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById('SOPrintableArea')

        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)
/*         const res = await axios.post('http://127.0.0.1:8000/api/pdf/manifest/create', data)

        const response = res.data */

        response.success && downloadBase64PDF(response.data.content, `SO-${data.value?.id || '1000'}.pdf`)

        isPrintButtonLoading.value = false
    }

    const formatApiData = () => {
        const response = {
            document_number: data.value.document_number,
            vendor_id: data.value?.order_supplies?.vendor_id,
            purchase_order_id: data.value?.order_supplies?.id,
            sales_order_number: data.value?.sales_order_number,
            order_supplies: data.value?.order_supplies?.supply
                ? data.value?.order_supplies?.supply.map(supply => {
                    return {
                        item_id: supply?.item_id,
                        quotation_id: supply?.quotation_id,
                        supply_id: supply?.supply_id ? supply?.supply_id : CUSTOM_SUPPLY_ID,
                        category_id: supply?.category_id ? Number(supply?.category_id) : null,
                        name: supply?.name,
                        description: supply?.description,
                        measure_id: supply?.measure_id,
                        sku: supply?.sku,
                        custom_product: supply?.custom_product,
                        quantity: supply?.quantity,
                        unit_price: supply?.unit_price
                    }
                })
                : null,
            ...variables.value,
            ...useAdditionalCosts.additionalCosts.value
        }

        return response
    }

    return {
        data,
        schema,
        errors,
        permissions,
        lockShippingCost,
        print,
        isPrintButtonLoading,
        variables,
        uniqueItem,
        subTotal,
        total,
        formatApiData
    }
}
