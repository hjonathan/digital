import {
    mdiSend,
    mdiPrinter
} from '@mdi/js'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore, configModal, useSalesOrder }) => {
    const { t } = useI18n()

    const { data, schema, errors, isPrintButtonLoading, formatApiData } = useSalesOrder

    const tabsStore = useGlobalStore('tabs')

    const rapidStore = useGlobalStore('rapidStore')

    const salesOrderStore = useGlobalStore('salesOrder')

    const processStore = useGlobalStore('process')

    return computed(() => {
        return [
            // Print
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                show: !!data.value.id,
                disabled: isPrintButtonLoading.value,
                spinner: isPrintButtonLoading.value,
                async action () {
                    await useSalesOrder.print()
                }
            },

            {
                icon: mdiSend,
                classType: 'primary',
                label: t('Submit'),
                show: schema.role === 'creator',
                action () {
                    configModal.value.confirmation = async () => {
                        const apiData = formatApiData()

                        const response = await api.post('/supplies/sales_order_build', apiData)

                        if (!response.errors && response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

                            rapidStore.$emitGlobalEvent('updateSupplyDashboard')

                            salesOrderStore.fetch()

                            processStore.fetch()

                            tabsStore.closeTab('CreateSalesOrder')

                            return
                        }

                        if (response.errors || !response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                            errors.value = response.errors
                        }
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to submit the sales order?')
                    configModal.value.confirmButtonLabel = t('Yes, submit')

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}
