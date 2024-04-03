import { useI18n } from 'vue-i18n'
import { mdiContentSave } from '@mdi/js'
import { jsonLogic } from 'jsonRules'
import { actionRules, genericLoading } from './configRules'
import { computed } from 'vue'

// Right buttons for save
export const configRightButtons = ({ actions, dataToValidate, rule }) => {
    const { t } = useI18n()

    return computed(() => [
        {
            icon: mdiContentSave,
            classType: 'teal',
            label: t('Save'),
            spinner: jsonLogic.apply(genericLoading, dataToValidate.value),
            disabled: !jsonLogic.apply(actionRules[rule], dataToValidate.value),
            action: () => {
                actions.save()
            }
        },
    ])
}
