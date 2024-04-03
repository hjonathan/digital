import { computed, shallowRef } from 'vue'
import { mdiPrinter, mdiSend, mdiCancel, mdiCheck } from '@mdi/js'
import { useI18n } from 'vue-i18n'

import ApproveModal from './ApproveModal.vue'
import RejectModal from './RejectModal.vue'
/**
 * Purchase request form
 * @returns
 */
export const configButtons = ({ useGlobalStore, usePurchaseRequest, configModal }) => {
    const { t } = useI18n()
    return computed(() => {
        const { schema, sendPurchaseRequestManager, isPrintButtonLoading } = usePurchaseRequest

        return [
            // Print
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                show: schema.value.role === 'show' || schema.value.role === 'approval',
                disabled: isPrintButtonLoading.value,
                spinner: isPrintButtonLoading.value,
                async action () {
                    await usePurchaseRequest.print()
                }
            },
            {
                icon: mdiSend,
                classType: 'primary',
                show: schema.value.role === 'creator',
                label: t('Submit'),
                async action () {
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await usePurchaseRequest.send()

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to send the purchase request?')
                    configModal.value.confirmButtonLabel = t('Yes, submit')

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject'),
                show: schema.value.role === 'approval',
                action () {
                    // Modal confirmation for confirmations
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await sendPurchaseRequestManager({ note, approval: false })

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to reject the purchase request? The process will stop and you will not be able to continue with the request.')
                    configModal.value.confirmButtonLabel = t('Yes, reject')
                    configModal.value.note = true
                    configModal.value.type = 'danger'
                    configModal.value.component = shallowRef(RejectModal)

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiCheck,
                classType: 'primary',
                label: t('Approve'),
                show: schema.value.role === 'approval',
                action () {
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await sendPurchaseRequestManager({ note, approval: true })

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to approve the purchase request?')
                    configModal.value.confirmButtonLabel = t('Yes, approve')
                    configModal.value.note = true
                    configModal.value.type = 'primary'
                    configModal.value.component = shallowRef(ApproveModal)

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}
