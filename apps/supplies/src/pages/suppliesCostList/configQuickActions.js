import { mdiFileDocument } from '@mdi/js'
import { useI18n } from 'vue-i18n'

/**
 * This file contains the button configuration for quick actions to the main item
 */
export const configQuickActions = ({ data, useGlobalStore }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')

    const response = [
        {
            icon: mdiFileDocument,
            label: t('Move'),
            type: 'button',
            disabled: !data.supply_order_id,
            action (rowData) {
                if (rowData.supply_order_id) {
                    tabsStore.openTab({ name: 'SuppliesShowInvoice', params: { id: rowData.supply_order_id } })
                }
            }
        },
    ]

    return response
}
