import {
    mdiSend,
    mdiCheck,
    mdiCancel,
    mdiPrinter
} from '@mdi/js'

import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

import ApproveModal from './ApproveModal.vue'
import RejectModal from './RejectModal.vue'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore, configModal, useDispatchNote }) => {
    const { t } = useI18n()

    return computed(() => {
        const { schema, print, isPrintButtonLoading, dispatchNote, dispatchNoteDelivery, type } = useDispatchNote

        return [
            // SHOW
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                disabled: isPrintButtonLoading.value,
                spinner: isPrintButtonLoading.value,
                show: schema.value.role === 'show',
                async action () {
                    await print('DNPrintableArea')
                }
            },
            {
                icon: mdiSend,
                classType: 'primary',
                label: t('Dispatch'),
                show: schema.value.role === 'creator',
                action () {
                    if (type.value === 'material-request') {
                        configModal.value.title = t('Confirmation')
                        configModal.value.description = t('Are you sure to dispach the request?')
                        configModal.value.confirmButtonLabel = t('Yes, dispatch')
                    }

                    if (type.value === 'purchase-request') {
                        configModal.value.title = t('Confirmation')
                        configModal.value.description = t('Are you sure to dispatch the request? With this action no more receives will be made.')
                        configModal.value.confirmButtonLabel = t('Yes, dispatch it')
                    }

                    if (type.value === 'material-assignment') {
                        configModal.value.title = t('Confirmation')
                        configModal.value.description = t('Are you sure to dispatch the assignment?')
                        configModal.value.confirmButtonLabel = t('Yes, dispatch it')
                    }

                    configModal.value.confirmation = async () => {
                        const response = await dispatchNote()

                        return response
                    }

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject'),
                show: schema.value.role === 'approval',
                action () {
                    configModal.value.template = 'rejectDispatchNote'

                    configModal.value.confirmation = async ({ note }) => {
                        const response = await dispatchNoteDelivery({ approval: false, note: note.value })

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to reject the materials?')
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
                label: t('Receive'),
                show: schema.value.role === 'approval',
                action () {
                    configModal.value.template = 'approveDispatchNote'

                    configModal.value.confirmation = async ({ note }) => {
                        const response = await dispatchNoteDelivery({ approval: true, note: note.value })

                        return response
                    }

                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to receive the materials? This action will end the receiving process.')
                    configModal.value.confirmButtonLabel = t('Yes, receive')
                    configModal.value.note = true
                    configModal.value.type = 'primary'
                    configModal.value.component = shallowRef(ApproveModal)

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}
