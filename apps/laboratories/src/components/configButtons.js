import { useI18n } from 'vue-i18n'
import { mdiPlus } from '@mdi/js'

/**
 * Buttons when: NOTHING is selected
 */
export const configButtons = ({ clientData, configSlideOver, actionView, idThread }) => {
    const { t } = useI18n()

    if (!idThread) {
        return [
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Create'),
                action: () => {
                    actionView.value.title = t('Create')

                    clientData.value = {}

                    configSlideOver.value.open = !configSlideOver.value.open
                }
            },
        ]
    }
}
