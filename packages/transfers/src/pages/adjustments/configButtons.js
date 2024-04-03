import {
    mdiCancel,
    mdiCheck
} from '@mdi/js'
import { jsonLogic } from 'jsonRules'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { rules } from '../configRules'

export const configButtons = ({ transferData, useSlideOver, useAlertModal, useGlobalStore, useAdjustments, initialItems, items }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')

    const { transferReceiveAdjust, transferAdjustmentApproved, transferAdjustmentRejected, updateStores, acceptItemFound, rejectItemFound, cancelAdjust } = useAdjustments

    const { configSlideOver, action, transferId, component, setOnSave, setOnAfterSave } = useSlideOver

    const { showAlert, configModal } = useAlertModal

    const tabsStore = useGlobalStore('tabs')

    const loadersButtons = ref({
        rejectAdjust: false,
        adjust: false
    })

    return computed(() => {
        return [
            {
                icon: mdiCancel,
                label: t('Cancel adjust'),
                classType: 'red',
                show: jsonLogic.apply(rules.cancelAdjust, transferData.value),
                action: async () => {
                    configModal.value.template = 'cancelAdjust'

                    // Modal confirmation
                    configModal.value.confirmation = async () => {
                        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjust canceled successful ') })

                        const response = await cancelAdjust(transferData.value.id)

                        response.success && tabsStore.closeTab('Adjustments')
                    }

                    showAlert.value = true
                }
            },
            {
                icon: mdiCancel,
                label: t('Cancel Item Found'),
                classType: 'red',
                show: jsonLogic.apply(rules.acceptItemFound, transferData.value),
                action: async () => {
                    configModal.value.template = 'rejectItemFound'

                    // Modal confirmation
                    configModal.value.confirmation = async () => {
                        const response = await rejectItemFound(transferData.value.id)

                        if (response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Item rejected successful ') })

                            updateStores()

                            tabsStore.closeTab('Adjustments')
                        }
                    }

                    showAlert.value = true
                }
            },
            {
                icon: mdiCancel,
                label: t('Reject Adjust'),
                classType: 'red',
                spinner: loadersButtons.value.rejectAdjust,
                disabled: loadersButtons.value.rejectAdjust,
                show: jsonLogic.apply(rules.adjustOrigin, transferData.value),
                action: async () => {
                    configModal.value.template = 'rejectAdjust'

                    // Modal confirmation
                    configModal.value.confirmation = async () => {
                        const response = await transferAdjustmentRejected()

                        if (response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjust rejected successful ') })

                            tabsStore.closeTab('Adjustments')
                        }
                    }

                    showAlert.value = true
                }
            },
            {
                icon: mdiCheck,
                label: t('Adjust'),
                spinner: loadersButtons.value.adjust,
                disabled: loadersButtons.value.adjust || !verifyItemsChanged(initialItems.value, items.value),
                show: jsonLogic.apply(rules.adjustDestination, transferData.value),
                action: async () => {
                    loadersButtons.value.adjust = true

                    const response = await transferReceiveAdjust()

                    loadersButtons.value.adjust = false

                    response.success && tabsStore.closeTab('Adjustments')

                    rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjustment request successful') })

                    // Close tab receive full
                    const transferTabs = tabsStore.getTabs('transfers')

                    const editTransferTab = transferTabs.find(tab => tab.name === 'Receive' && tab.params.id === transferData.value.id)

                    editTransferTab && tabsStore.closeTab('Receive')
                }
            },
            {
                icon: mdiCheck,
                label: t('Accept adjustment'),
                show: jsonLogic.apply(rules.adjustOrigin, transferData.value),
                action: async () => {
                    configModal.value.template = 'acceptAdjust'

                    // Modal confirmation
                    configModal.value.confirmation = async () => {
                        const response = await transferAdjustmentApproved()

                        if (response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjust accepted successful ') })

                            updateStores()

                            tabsStore.closeTab('Adjustments')
                        }
                    }

                    showAlert.value = true
                }
            },
            {
                icon: mdiCheck,
                label: t('Accept Item Found'),
                show: jsonLogic.apply(rules.acceptItemFound, transferData.value),
                action: async () => {
                    configModal.value.template = 'acceptItemFound'

                    // Modal confirmation
                    configModal.value.confirmation = async () => {
                        const response = await acceptItemFound(transferData.value.id)

                        if (response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Item accepted successful ') })

                            tabsStore.closeTab('Adjustments')
                        }
                    }

                    showAlert.value = true
                }
            },
        ]
    })
}

export const verifyItemsChanged = (oldValue, newValue) => {
    const response = oldValue.some((obj1, index) => {
        const obj2 = newValue[index]

        if (obj1.quantity !== obj2.quantity) { return true }

        if (obj1.item_transfer_type_id !== obj2.item_transfer_type_id && obj2.item_transfer_type_id === 2) { return true }

        return false
    })

    return response
}
