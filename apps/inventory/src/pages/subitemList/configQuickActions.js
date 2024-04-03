import {
    mdiClipboardTextClockOutline,
    mdiCursorMove,
    mdiCallSplit,
    mdiLockOutline
} from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { jsonLogic, genericRules } from 'jsonRules'

/**
 * This file contains the button configuration for quick actions to the sub-item
 */
export const configQuickActions = ({ data, useGlobalStore, key }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')

    const slideAction = rapidStore.reactiveProperty(`slide-${key}`)

    const tabsStore = useGlobalStore('tabs')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    const dataJsonRules = {
        selectedRow: data
    }

    const response = [
        {
            icon: mdiClipboardTextClockOutline,
            label: t('History'),
            type: 'button'
        },
        {
            icon: mdiCursorMove,
            label: t('Move'),
            type: 'button',
            hide: jsonLogic.apply(genericRules.draft, dataJsonRules),
            action (rowData) {
                selectedRows.value = [rowData]

                slideAction.value = {
                    action: 'Move'
                }
            }
        },
        {
            icon: mdiCallSplit,
            label: t('Split'),
            type: 'button',
            hide: jsonLogic.apply(genericRules.draft, dataJsonRules),
            action: (data) => {
                tabsStore.closeTab('inventory-split')

                tabsStore.openTab({
                    path: `/inventory/split/${data.id}`,
                    query: { type: 'child' }
                })
            }
        },
        {
            icon: mdiLockOutline,
            label: t('Lock'),
            type: 'button'
        },
    ]

    return response
}
