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
                tabsStore.closeTab('SuppliesLabelsEdit')

                const timeToWaitRenderTab = 200

                setTimeout(() => {
                    tabsStore.openTab({
                        path: `/supplies/labels/edit/${data.id}`,
                        params: {
                            id: data.id
                        }
                    })
                }, timeToWaitRenderTab)
            }
        },
        {
            icon: mdiVectorArrangeBelow,
            label: t('Clone'),
            type: 'button',
            action: (data) => {
                tabsStore.closeTab('SuppliesLabelsClone')

                const timeToWaitRenderTab = 200

                setTimeout(() => {
                    tabsStore.openTab({
                        path: `/supplies/labels/clone/${data.id}`,
                        query: {
                            mode: 'clone'
                        }
                    })
                }, timeToWaitRenderTab)
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
