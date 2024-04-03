import {
    mdiArrowRight
} from '@mdi/js'

import { computed } from 'vue'
import { isNumber } from 'lodash'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useLabels }) => {
    return computed(() => {
        return [
            {
                icon: mdiArrowRight,
                label: 'Set label quantities',
                classType: 'primary',
                disabled: !isNumber(useLabels.labelSelected?.value?.id),
                action: (data) => {
                    useLabels.step.value = 'section_quantity'

                    useLabels.enableQuantityStep()
                }
            },
        ]
    })
}
