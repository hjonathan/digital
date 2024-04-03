import { computed, inject, ref } from 'vue'
import { downloadBase64PDF, round } from 'shared'
import { api } from '@/config'
import moment from 'moment-timezone'
import { useFormComponent } from 'form'
import { cloneDeep } from 'lodash'
import { useI18n } from 'vue-i18n'

export const useWarehouseReceipt = () => {
    const { t } = useI18n()

    const useGlobalStore = inject('useGlobalStore')
    const coreStore = useGlobalStore('core')
    const rapidStore = useGlobalStore('rapidStore')
    const unknownSuppliesStore = useGlobalStore('unknownSupplies')
    const tabsStore = useGlobalStore('tabs')

    const permissions = coreStore.getPermissions()
    const isLoading = ref(false)

    const { finalStyles } = useFormComponent()

    const isPrintButtonLoading = ref(false)

    const schema = computed(() => {
        return { role: data.value.id ? 'show' : 'creator' }
    })

    const syncStores = () => {
        unknownSuppliesStore.fetch()
    }

    const data = ref({
        sales_order_number: null,
        receiver: {
            ...coreStore.credentials?.user,
            reception_date: moment(new Date()).format('DD/MM/YYYY')
        },
        shipping_cost: 0,
        taxes: 0,
        handling: 0,
        estimated_shipping: 0,
        supplies: []
    })

    const submit = async () => {
        const supplies = data.value.supplies.map(e => {
            const dataClone = cloneDeep(e)

            delete dataClone.supply
            delete dataClone.measure

            return {
                ...dataClone,
                supply_id: e.supply?.id || e.supply_id,
                name: e.name,
                measure_id: e.measure_id || e.measure?.id
            }
        })

        const response = await api.post('/supplies/warehouse_receipt_unknown_supply_build', {
            vendor_id: data.value.vendor?.id,
            order_supplies: supplies,
            tracking_id: data.value.tracking_id
        })

        if (!response.errors && response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

            rapidStore.$emitGlobalEvent('updateSupplyDashboard')

            syncStores()

            tabsStore.closeTab('CreateReceipt')
        }

        if (response.errors || !response.success) {
            errors.value = response.errors

            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })
        }
    }

    const errors = ref({})

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
        print,
        submit,
        isLoading,
        isPrintButtonLoading
    }
}
