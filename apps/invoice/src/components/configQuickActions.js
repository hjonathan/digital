import { mdiPencil, mdiEye } from '@mdi/js'
import { useI18n } from 'vue-i18n'

/**
 * This file contains the button configuration for quick actions to the main item
 */
export const configQuickActions = ({ data, useGlobalStore, key }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')

    const response = [
        {
            icon: data.invoice_status.slug === 'draft' ? mdiPencil : mdiEye,
            label: data.invoice_status.slug === 'draft' ? t('Edit') : t('Show'),
            type: 'button',
            action: (data) => {
                if (data.invoice_status.slug === 'draft') {
                    tabsStore.openTab({
                        path: `invoicing/edit/${data.id}`,
                        params: { id: data.id },
                        name: 'EditInvoice'
                    })
                }

                if (data.invoice_status.slug === 'invoiced') {
                    tabsStore.openTab({
                        path: `invoicing/show/${data.id}`,
                        params: { id: data.id },
                        name: 'ShowInvoice'
                    })
                }
            }
        },
    ]

    return response
}
