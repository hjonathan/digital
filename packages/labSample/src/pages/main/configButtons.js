import { computed } from 'vue'
import {
    mdiTestTubeEmpty,
    mdiInboxArrowDown,
    mdiEye,
    mdiLockOutline,
    mdiFlaskEmptyOutline,
    mdiWeight,
    mdiRefresh,
    mdiCursorMove,
    mdiLockOpenOutline,
    mdiBottleTonicSkullOutline
} from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { genericRules, jsonLogic } from 'jsonRules'
import { actionRules } from './configRules'
/**
 * Lab sample main buttons configuration
 * @returns Buttons Array
 */
export const configButtons = ({ useGlobalStore, apiGrid, key }) => computed(() => {
    return labButtons({ useGlobalStore, apiGrid, key })
})

export const labButtons = ({ useGlobalStore, apiGrid, key }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)
    const slideAction = rapidStore.reactiveProperty(`slide-${key}`)

    const openSlide = rapidStore.$getCallback(`open-slide-action-${key}`)

    const data = {
        selectedRows: selectedRows.value
    }

    const query = {
        id: selectedRows.value?.length ? selectedRows.value[0].id || selectedRows.value[0].id_full : null
    }

    return [
        {
            icon: mdiTestTubeEmpty,
            label: t('Send lab sample'),
            classType: 'primary',
            disabled: !jsonLogic.apply(actionRules.sendLabSample, data),
            action: () => {
                tabsStore.openTab({
                    path: '/send-lab-sample',
                    query: {
                        ...query,
                        type: 'send'
                    }
                })
            }
        },
        // Receive results
        {
            icon: mdiInboxArrowDown,
            label: t('Receive results'),
            classType: 'primary',
            disabled: !jsonLogic.apply(actionRules.receiveResults, data),
            action: () => {
                tabsStore.openTab({
                    path: '/receive-lab-result',
                    query: {
                        ...query,
                        lab_number: 1
                    }
                })
            }
        },
        // Show
        {
            icon: mdiEye,
            label: t('Show'),
            classType: 'primary',
            disabled: !jsonLogic.apply(actionRules.show, data),
            action: () => {
                tabsStore.openTab({
                    path: `/lab-sample/show/${selectedRows.value[0].id || selectedRows.value[0].id_item}`,
                    query: {
                        lab_number: selectedRows.value[0]?.lab_result_number
                    }
                })
            }
        },
        // PRIMARY
        // Move
        {
            icon: mdiCursorMove,
            classType: 'primary',
            label: t('Move'),
            disabled: !jsonLogic.apply(actionRules.move, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Move' }
            }
        },
        // Convert
        {
            icon: mdiRefresh,
            classType: 'primary',
            label: t('Convert'),
            disabled: !jsonLogic.apply(actionRules.convert, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Convert' }
            }
        },
        /**
         * Lock section
         **/
        // Lock
        {
            icon: mdiLockOutline,
            classType: 'primary',
            label: t('Lock'),
            disabled: !jsonLogic.apply(actionRules.convert, data),
            action: () => {
                openSlide()

                slideAction.value = { action: 'Lock' }
            }
        },
        // Resend
        {
            icon: mdiTestTubeEmpty,
            label: t('Re send lab sample'),
            classType: 'primary',
            show: jsonLogic.apply(actionRules.resendLabSample, data),
            action: () => {
                tabsStore.openTab({
                    path: '/send-lab-sample',
                    query: {
                        ...query,
                        type: 'resend'
                    }
                })
            }
        },
        // Receive 2nd
        {
            icon: mdiInboxArrowDown,
            label: t('Receive results 2nd time'),
            classType: 'primary',
            show: jsonLogic.apply(actionRules.receive2Results, data),
            action: () => {
                tabsStore.openTab({
                    path: '/receive-lab-result',
                    query: {
                        ...query,
                        lab_number: 2
                    }
                })
            }
        },
        // Receive 2rd
        {
            icon: mdiInboxArrowDown,
            label: t('Receive results 3rd time'),
            classType: 'primary',
            show: jsonLogic.apply(actionRules.receive3Results, data),
            action: () => {
                tabsStore.openTab({
                    path: '/receive-lab-result',
                    query: {
                        ...query,
                        lab_number: 3
                    }
                })
            }
        },
        // Reweight
        {
            icon: mdiWeight,
            label: 'Reweight',
            classType: 'warning',
            type: 'button',
            disabled: !jsonLogic.apply(actionRules.reweight, data),
            action: (data) => {
                openSlide()

                slideAction.value = { action: 'Reweight' }
            }
        },
        // Recall
        {
            icon: mdiBottleTonicSkullOutline,
            classType: 'red',
            label: t('Recall'),
            disabled: !jsonLogic.apply(actionRules.recall, data),
            action () {
                openSlide()

                slideAction.value = { action: 'Recall' }
            }
        },
    ]
}
