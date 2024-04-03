import { computed, shallowRef } from 'vue'
import { mdiCheckAll, mdiSend, mdiCancel, mdiPrinter } from '@mdi/js'
import { useI18n } from 'vue-i18n'

import ApproveModal from './ApproveModal.vue'
import RejectModal from './RejectModal.vue'

/**
 * Purchase request form
 * @returns
 */
export const configButtons = ({ useGlobalStore, usePurchaseOrder, configModal }) => {
    const { t } = useI18n()

    const { schema, isPrintButtonLoading } = usePurchaseOrder

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
                    await usePurchaseOrder.print()
                }
            },
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject'),
                show: schema.value.role === 'manager',
                async action () {
                    configModal.value.template = 'rejectPurchaseOrder'

                    configModal.value.confirmation = async ({ note }) => {
                        const response = await usePurchaseOrder.sendPurchaseOrderManager({ note, approval: false })

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to reject the purchase order? The process will stop and you will not be able to continue with the request.')
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
                        const response = await usePurchaseOrder.sendPurchaseOrderManager({ note, approval: true })

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to approve the purchase order?')
                    configModal.value.confirmButtonLabel = t('Yes, approve')
                    configModal.value.note = true
                    configModal.value.type = 'primary'
                    configModal.value.component = shallowRef(ApproveModal)

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
                        await usePurchaseOrder.send()
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to send the purchase order?')
                    configModal.value.confirmButtonLabel = t('Yes, submit')

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}
