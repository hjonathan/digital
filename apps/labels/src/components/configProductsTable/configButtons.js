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
export const configButtons = ({ disabled = false, useLabels }) => {
    return computed(() => {
        return [
            {
                icon: mdiArrowRight,
                label: 'Select label template',
                type: 'button',
                classType: 'primary',
                disabled: useLabels.productsSelected.value.length === 0,
                counter: useLabels.productsSelected.value.length,
                action: (data) => {
                    useLabels.step.value = 'section_template'

                    // If no label selected, disable next button on template step
                    if (!isNumber(useLabels.labelSelected?.value?.id)) {
                        useLabels.disableNextButton.value = true
                    }
                }
            },
        ]
    })
}
