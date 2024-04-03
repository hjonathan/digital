import {
    mdiPrinter,
    mdiCancel,
    mdiInboxArrowDown,
    mdiCheck
} from '@mdi/js'
import { showUuid } from 'shared'
import { computed, markRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import Receive from '../transfer/Receive.vue'
import Reject from '../transfer/Reject.vue'
import { jsonLogic } from 'jsonRules'
import { buttonRulesDisable } from './configRules'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ actions, isLoading, mode, useShow, transferId, useGlobalStore }) => {
    if (mode === 'show') return showButtons({ actions, isLoading, mode, useShow, transferId, useGlobalStore })

    if (mode === 'receive') return receiveButtons({ actions, isLoading, mode, useShow, transferId, useGlobalStore })
}

export const showButtons = ({ actions, isLoading, mode, useShow, transferId, useGlobalStore }) => {
    const { t } = useI18n()

    return computed(() => {
        return [
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                spinner: isLoading.value,
                disabled: isLoading.value,
                action () {
                    actions.print()
                }
            },
        ]
    })
}

export const receiveButtons = ({ actions, isLoading, mode, useShow, transferId, useGlobalStore }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        const { actionView, configSlideOver, globalTransferData } = useShow

        return [
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject transfer'),
                show: jsonLogic.apply(buttonRulesDisable.reject, globalTransferData.value),
                action: async (data) => {
                    actionView.value.title = t('Reject transfer')

                    actionView.value.id = showUuid(transferId)

                    actionView.value.type = 'reject'

                    actionView.value.component = markRaw(Reject)

                    configSlideOver.value.open = !configSlideOver.value.open
                }
            },
            {
                icon: mdiInboxArrowDown,
                classType: 'primary',
                label: t('Receive transfer'),
                show: jsonLogic.apply(buttonRulesDisable.receive, globalTransferData.value),
                action: async () => {
                    actionView.value.title = t('Receive transfer')

                    actionView.value.id = showUuid(transferId)

                    actionView.value.type = 'receive'

                    actionView.value.component = markRaw(Receive)

                    configSlideOver.value.open = !configSlideOver.value.open
                }
            },
            {
                icon: mdiCheck,
                classType: 'primary',
                label: t('Accept transfer'),
                show: jsonLogic.apply(buttonRulesDisable.accept, globalTransferData.value),
                action: async () => {
                    const { showConfirmAcceptModal } = useShow

                    showConfirmAcceptModal.value = true
                }
            },
        ]
    })
}
