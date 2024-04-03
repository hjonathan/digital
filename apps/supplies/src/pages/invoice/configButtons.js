import { computed, shallowRef } from 'vue'
import { mdiCheckAll, mdiSend, mdiCancel, mdiPrinter } from '@mdi/js'
import { useI18n } from 'vue-i18n'

import ApproveModal from './ApproveModal.vue'
import RejectModal from './RejectModal.vue'
/**
 * Purchase request form
 * @returns
 */
export const configButtons = ({ useGlobalStore, useInvoice, configModal }) => {
    const { t } = useI18n()

    const { schema, isPrintButtonLoading } = useInvoice

    return computed(() => {
        return [
            // Print
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                show: schema.value.role === 'show' || schema.value.role === 'manager',
                disabled: isPrintButtonLoading.value,
                spinner: isPrintButtonLoading.value,
                async action () {
                    await useInvoice.print()
                }
            },

            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject'),
                show: schema.value.role === 'manager',
                async action () {
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await useInvoice.sendPurchaseOrderManager({ note, approval: false })

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to reject the invoice?')
                    configModal.value.confirmButtonLabel = t('Yes, reject')
                    configModal.value.note = true
                    configModal.value.type = 'danger'
                    configModal.value.component = shallowRef(RejectModal)

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiCheckAll,
                classType: 'teal',
                label: t('Approve'),
                show: schema.value.role === 'manager',
                async action () {
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await useInvoice.sendPurchaseOrderManager({ note, approval: true })

                        return response
                    }

                    configModal.value.title = t('Confirmation?')
                    configModal.value.description = t('Are you sure to approve the invoice?')
                    configModal.value.confirmButtonLabel = t('Yes, approve it')
                    configModal.value.note = true
                    configModal.value.component = shallowRef(ApproveModal)
                    configModal.value.type = 'primary'

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiSend,
                classType: 'primary',
                label: t('Submit'),
                show: schema.value.role === 'creator',
                async action () {
                    configModal.value.confirmation = async ({ note }) => {
                        await useInvoice.send()
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to send the receive data?')
                    configModal.value.confirmButtonLabel = t('Send')

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}
