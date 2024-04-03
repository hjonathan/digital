import {
    mdiPlus
} from '@mdi/js'

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        return [
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Create'),
                disabled: false,
                action: () => {
                    tabsStore.openTab({
                        path: '/labels/create'
                    })
                }
            },
        ]
    })
}
