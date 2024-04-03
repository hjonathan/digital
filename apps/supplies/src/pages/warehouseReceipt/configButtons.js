import { mdiSend, mdiPrinter } from '@mdi/js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore, useWarehouseReceipt, configModal }) => {
    const { t } = useI18n()

    return computed(() => {
        const { submit, schema, print, isPrintButtonLoading } = useWarehouseReceipt
        return [
            {
                icon: mdiSend,
                classType: 'primary',
                label: t('Receive'),
                show: schema.value.role === 'creator',
                action () {
                    configModal.value.confirmation = async () => {
                        const response = await submit()
                        return response
                    }

                    configModal.value = {
                        ...configModal.value,
                        title: t('Confirmation'),
                        description: t('Are you sure to receive the items?'),
                        confirmButtonLabel: t('Receive'),
                        showAlert: true
                    }
                }
            },
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                show: schema.value.role !== 'creator',
                disabled: isPrintButtonLoading.value,
                spinner: isPrintButtonLoading.value,
                async action () {
                    await print()
                }
            },
        ]
    })
}
