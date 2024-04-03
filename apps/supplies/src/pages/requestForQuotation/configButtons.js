import { computed } from 'vue'
import { mdiPrinter, mdiSend } from '@mdi/js'
import { useI18n } from 'vue-i18n'

/**
 * Purchase request form
 * @returns
 */
export const configButtons = ({ useGlobalStore, useRequestForQuotation, configModal }) => {
    const { t } = useI18n()
    return computed(() => {
        const { data, isPrintButtonLoading } = useRequestForQuotation

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
                    await useRequestForQuotation.print()
                }
            },

            // Submit
            {
                icon: mdiSend,
                classType: 'primary',
                label: t('Submit'),
                show: !data.value.id,
                async action () {
                    data.value.send_mail = true

                    data.value.send_copy_mail = true

                    configModal.value.modelData = data

                    configModal.value.confirmation = async ({ note }) => {
                        const response = await useRequestForQuotation.send()

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to send the request for quotation?')
                    configModal.value.confirmButtonLabel = t('Send')

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}
