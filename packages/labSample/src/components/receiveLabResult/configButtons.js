import { useI18n } from 'vue-i18n'
import { mdiPrinter, mdiContentSave } from '@mdi/js'
import { jsonLogic } from 'jsonRules'
import { actionRules } from './configRules'
import { computed } from 'vue'
// Left buttons send lab sample
export const configLeftButtons = ({ useGlobalStore, actions, data }) => {
    const { t } = useI18n()

    return computed(() => [
        {
            icon: mdiPrinter,
            classType: 'primary',
            label: t('Print'),
            spinner: !jsonLogic.apply(actionRules.print, data.value),
            disabled: !jsonLogic.apply(actionRules.print, data.value),
            action: () => {
                actions.print()
            }
        },
    ])
}

// Right buttons for save lab result
export const configRightButtons = ({ useGlobalStore, actions, data }) => {
    const { t } = useI18n()

    return computed(() => [
        {
            icon: mdiContentSave,
            classType: 'teal',
            label: t('Save'),
            spinner: !jsonLogic.apply(actionRules.save, data.value),
            disabled: !jsonLogic.apply(actionRules.save, data.value),
            action: () => {
                actions.save()
            }
        },
    ])
}
