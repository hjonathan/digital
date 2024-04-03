import {
    mdiCancel,
    mdiInboxArrowDown,
    mdiSyncAlert,
    mdiCheck
} from '@mdi/js'
import { jsonLogic } from 'jsonRules'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { rules } from '../configRules'

export const configButtons = ({ transferData, useSlideOver, useAlertModal, useGlobalStore, useReceiveAdjustment }) => {
    const { t } = useI18n()

    const { configSlideOver, action, transferId, component, setOnSave, setOnAfterSave } = useSlideOver

    const { showAlert, configModal } = useAlertModal

    const { acceptTransfer, updateStores } = useReceiveAdjustment

    const tabsStore = useGlobalStore('tabs')

    const rapidStore = useGlobalStore('rapidStore')

    const loadersButtons = ref({
        cancelTransfer: false
    })

    return computed(() => {
        return [
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Cancel transfer'),
                spinner: loadersButtons.value.cancelTransfer,
                disabled: loadersButtons.value.cancelTransfer,
                show: jsonLogic.apply(rules.cancelTransfer, transferData.value),
                action: async (data) => {
                    transferId.value = transferData.value.id

                    action.value = 'Cancel'

                    // Slide over save configuration
                    setOnSave('Cancel', () => {
                        configModal.value.template = 'cancelTransfer'

                        // Modal confirmation for confirmations
                        configModal.value.confirm = async () => {
                            loadersButtons.value.cancelTransfer = true

                            const response = await component.value.form.save()

                            if (response.success) {
                                updateStores()

                                configSlideOver.value.close = !configSlideOver.value.close

                                tabsStore.closeTab('Receive')
                            }
                        }

                        loadersButtons.value.cancelTransfer = false

                        // Show confirmation modal
                        showAlert.value = true
                    })

                    // Show confirmation modal
                    configSlideOver.value.open = !configSlideOver.value.open
                }
            },
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject transfer'),
                show: jsonLogic.apply(rules.rejectTransfer, transferData.value),
                action: async (data) => {
                    transferId.value = transferData.value.id

                    action.value = 'Reject'

                    // Slide over save configuration
                    setOnSave('Reject', () => {
                        configModal.value.template = 'cancelReject'

                        // Modal confirmation for confirmations
                        configModal.value.confirm = async () => {
                            const response = await component.value.form.save()

                            if (response.success) {
                                updateStores()

                                configSlideOver.value.close = !configSlideOver.value.close

                                tabsStore.closeTab('Receive')
                            }
                        }

                        // Show confirmation modal
                        showAlert.value = true
                    })

                    // Show confirmation modal
                    configSlideOver.value.open = !configSlideOver.value.open
                }
            },
            {
                icon: mdiInboxArrowDown,
                classType: 'primary',
                label: t('Receive transfer'),
                show: jsonLogic.apply(rules.receiveTransfer, transferData.value),
                action: async () => {
                    transferId.value = transferData.value.id

                    action.value = 'Receive'

                    configSlideOver.value.open = !configSlideOver.value.open

                    setOnAfterSave('Receive', () => {
                        updateStores()

                        tabsStore.closeTab('Receive')
                    })
                }
            },
            {
                icon: mdiSyncAlert,
                classType: 'primary',
                label: t('Adjust transfer'),
                show: jsonLogic.apply(rules.adjustTransfer, transferData.value),
                action: async () => {
                    tabsStore.openTab({ name: 'Adjustments', params: { id: transferData.value.id } })
                }
            },
            {
                icon: mdiCheck,
                classType: 'primary',
                label: t('Accept transfer'),
                show: jsonLogic.apply(rules.acceptTransfer, transferData.value),
                action: async () => {
                    configModal.value.template = 'acceptTransfer'

                    // Modal confirmation for confirmations
                    configModal.value.confirmation = async () => {
                        const response = await acceptTransfer(transferData.value.id)

                        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Transfer accepted successful ') })

                        if (response.success) {
                            updateStores()

                            tabsStore.closeTab('Receive')
                        }
                    }

                    // Show confirmation modal
                    showAlert.value = true
                }
            },
        ]
    })
}
