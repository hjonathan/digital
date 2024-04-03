import { mdiSend, mdiCheck, mdiCancel, mdiPrinter } from '@mdi/js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore, useAlertModal, useSupplyAdjustment, configModal }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')

    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        const { schema, errors, isPrintButtonLoading, formatApiData, syncTabs, approve, reject } = useSupplyAdjustment

        return [
            // Print
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                show: schema.value.role === 'show',
                disabled: isPrintButtonLoading.value,
                spinner: isPrintButtonLoading.value,
                async action () {
                    await useSupplyAdjustment.print()
                }
            },

            // MANAGER
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject'),
                show: schema.value.role === 'manager',
                action () {
                    // Modal confirmation for confirmations
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await reject(note.value)

                        if (response.errors || !response.success || response.exception) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                            errors.value = response.errors

                            return {
                                errors: {
                                    message: t(response.message)
                                }
                            }
                        }
                    }

                    // Show confirmation modal
                    configModal.value.type = 'danger'
                    configModal.value.note = true
                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Reject Supply adjustment?')
                    configModal.value.confirmButtonLabel = t('Yes, reject it')

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiCheck,
                classType: 'primary',
                label: t('Approve'),
                show: schema.value.role === 'manager',
                action () {
                    // Modal confirmation for confirmations API:
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await approve(note.value)

                        if (response.errors || !response.success || response.exception) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                            errors.value = response.errors

                            return {
                                errors: {
                                    message: t(response.message)
                                }
                            }
                        }
                    }

                    // Show confirmation modal
                    configModal.value.type = 'primary'
                    configModal.value.note = true
                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Approve supply adjustment?')
                    configModal.value.confirmButtonLabel = t('Yes, approve it')

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiSend,
                classType: 'primary',
                label: t('Submit'),
                show: schema.value.role === 'creator',
                action () {
                    // Modal confirmation for confirmations
                    configModal.value.confirmation = async () => {
                        const apiData = formatApiData()

                        const response = await api.post('/supplies/adjutment_build', apiData)

                        if (response.success) {
                            syncTabs()

                            tabsStore.closeTab('CreateSupplyAdjustment')

                            tabsStore.openTab({ name: 'SupplyAdjustmentList' })
                        }

                        if (response.errors || !response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                            errors.value = response.errors
                        }
                    }

                    // Show confirmation modal
                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Are you sure to send the supply adjustment?')
                    configModal.value.confirmButtonLabel = t('Send')

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}
