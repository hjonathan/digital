import { nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import {
    mdiPencil,
    mdiVectorArrangeBelow,
    mdiTrashCanOutline,
    mdiFileSendOutline
} from '@mdi/js'

/**
 * This file contains the button configuration for quick actions to the main item
 */
export const configQuickActions = ({ data, useGlobalStore, openDeleteConfirmationModal }) => {
    const tabsStore = useGlobalStore('tabs')

    const { t } = useI18n()

    const labelsStore = useGlobalStore('labels')

    const response = [
        {
            icon: mdiPencil,
            label: t('Edit label'),
            type: 'button',
            action: (data) => {
                tabsStore.closeTab('LabelsEdit')

                tabsStore.openTab({
                    path: `/labels/edit/${data.id}`,
                    params: {
                        id: data.id
                    }
                })
            }
        },
        {
            icon: mdiFileSendOutline,
            label: t('Select & use'),
            type: 'button',
            action: (data) => {
                labelsStore.setLabel(data)

                tabsStore.closeTab('labels-print')

                nextTick(() => {
                    tabsStore.openTab({
                        path: '/labels/print'
                    })
                })
            }
        },
        {
            icon: mdiVectorArrangeBelow,
            label: t('Clone'),
            type: 'button',
            action: (data) => {
                tabsStore.closeTab('LabelsClone')

                tabsStore.openTab({
                    path: `/labels/clone/${data.id}`,
                    query: {
                        mode: 'clone'
                    }
                })
            }
        },
        {
            icon: mdiTrashCanOutline,
            label: t('Delete'),
            type: 'button',
            action: (data) => {
                openDeleteConfirmationModal(data)
            }
        },
    ]

    return response
}
