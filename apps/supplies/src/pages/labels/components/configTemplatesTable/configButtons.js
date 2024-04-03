import {
    mdiArrowRight,
    mdiPlus
} from '@mdi/js'

import { computed } from 'vue'
import { isNumber } from 'lodash'
import { useI18n } from 'vue-i18n'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useLabels, useGlobalStore }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        return [
            {
                icon: mdiPlus,
                label: t('Create template'),
                classType: 'primary',
                disabled: isNumber(useLabels.labelSelected?.value?.id),
                permission: 'supplies.labels.create',
                action: (data) => {
                    tabsStore.openTab({
                        path: '/supplies/labels/create'
                    })
                }
            },
            {
                icon: mdiArrowRight,
                label: t('Select supplies'),
                classType: 'primary',
                disabled: !isNumber(useLabels.labelSelected?.value?.id),
                action: (data) => {
                    useLabels.step.value = 'section_supplies'
                }
            },
        ]
    })
}
