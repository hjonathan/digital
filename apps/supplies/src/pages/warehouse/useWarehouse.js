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
            vendor_id: data.value?.order_supplies?.vendor_id,
            invoice_id: data.value?.order_supplies?.id,
            document_number: data.value.document_number || data.value?.order_supplies?.document_number,
            stageId: data.value.stageId,
            processId: data.value.processId,
            supplyOrderId: data.value.supplyOrderId,
            supplyOrderType: data.value.supplyOrderType,
            processStageDocumentTypeId: data.value.processStageDocumentTypeId,
            order_supplies: data.value?.order_supplies?.supply
                ? data.value?.order_supplies?.supply.map(supply => {
                    return {
                        id: supply?.id,
                        item_id: supply?.item_id,
                        supply_id: supply?.supply_id,
                        category_id: supply?.category_id ? Number(supply?.category_id) : null,
                        name: supply?.name,
                        description: supply?.description,
                        measure_id: supply?.measure_id,
                        sku: supply?.sku,
                        custom_product: supply?.custom_product,
                        quantity: !supply.partsItems.length ? supply?.quantity : 0,
                        unit_price: supply?.unit_price,
                        location_id: supply?.location_id,
                        partsItems: supply.partsItems
                    }
                })
                : null,
            ...variables.value,
            ...useAdditionalCosts.additionalCosts.value
        }
    }

    const print = async () => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById('WHPrintableArea')

        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)

        response.success && downloadBase64PDF(response.data.content, `WR-${data.value?.id || '1000'}.pdf`)

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
        formatApiData
    }
}
