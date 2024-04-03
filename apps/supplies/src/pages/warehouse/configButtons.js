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
export const configButtons = ({ useGlobalStore, configModal, useWarehouse }) => {
    const { t } = useI18n()

    const { data, schema, errors, variables, isPrintButtonLoading, formatApiData } = useWarehouse

    const rapidStore = useGlobalStore('rapidStore')

    const tabsStore = useGlobalStore('tabs')

    const warehouseReceiptStore = useGlobalStore('warehouse')
    const suppliesCostStore = useGlobalStore('suppliesCost')
    const suppliesTransactionStore = useGlobalStore('suppliesTransaction')

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
                    await useWarehouse.print()
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

                        const response = await api.post('/supplies/warehouse_receipt_build', apiData)

                        if (!response.errors && response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

                            rapidStore.$emitGlobalEvent('updateSupplyDashboard')

                            warehouseReceiptStore.fetch()

                            processStore.fetch()

                            suppliesCostStore.fetch()

                            suppliesTransactionStore.fetch()

                            tabsStore.closeTab('CreateWarehouseReceipt')

                            return
                        }

                        if (response.errors || !response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                            errors.value = response.errors
                        }
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to submit the warehouse receipt?')
                    configModal.value.confirmButtonLabel = t('Submit')

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}
