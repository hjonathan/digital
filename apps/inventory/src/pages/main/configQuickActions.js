import {
    mdiClipboardTextClockOutline,
    mdiSlashForward,
    mdiCursorMove,
    mdiCallSplit,
    mdiLockOutline,
    mdiPrinter
} from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { actionRules } from '../configRules'
import { jsonLogic, genericRules } from 'jsonRules'

/**
 * This file contains the button configuration for quick actions to the main item
 */
export const configQuickActions = ({ data, useGlobalStore, key }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')

    const slideAction = rapidStore.reactiveProperty(`slide-${key}`)

    const tabsStore = useGlobalStore('tabs')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    const openSlide = rapidStore.$getCallback(`open-slide-action-${key}`)

    const dataJsonRules = {
        selectedRows: [data]
    }

    const response = [
        {
            icon: mdiClipboardTextClockOutline,
            label: t('History'),
            type: 'button',
            disabled: true
        },
        {
            icon: mdiCursorMove,
            label: t('Move'),
            type: 'button',
            disabled: !jsonLogic.apply(actionRules.genericAction, dataJsonRules),
            action (rowData) {
                selectedRows.value = [rowData]

                slideAction.value = { action: 'Move' }

                openSlide()
            }
        },
        {
            icon: mdiSlashForward,
            label: t('Subdivide'),
            type: 'button',
            disabled: !jsonLogic.apply(actionRules.genericAction, dataJsonRules),
            action: (data) => {
                tabsStore.closeTab('inventory-subdivide')

                tabsStore.openTab({
                    path: `/inventory/subdivide/${data.id}`
                })
            }
        },
        {
            icon: mdiCallSplit,
            label: t('Split'),
            type: 'button',
            disabled: !jsonLogic.apply(actionRules.split, dataJsonRules),
            action: (data) => {
                tabsStore.closeTab('inventory-split')

                tabsStore.openTab({
                    path: `/inventory/split/${data.id}`
                })
            }
        },
        {
            icon: mdiPrinter,
            label: t('Print'),
            type: 'button',
            disabled: !jsonLogic.apply(genericRules.notParent, dataJsonRules),
            action (rowData) {
                selectedRows.value = [rowData]

                slideAction.value = { action: 'Print' }

                openSlide()
            }
        },
        {
            icon: mdiLockOutline,
            label: t('Lock'),
            type: 'button',
            disabled: !jsonLogic.apply(actionRules.lock, dataJsonRules),
            action (rowData) {
                selectedRows.value = [rowData]

                slideAction.value = { action: 'Lock' }

                openSlide()
            }
        },
    ]

    return response
}
