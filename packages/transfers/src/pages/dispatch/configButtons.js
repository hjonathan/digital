import { computed } from 'vue'
import { mdiPlus, mdiPen, mdiEye } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { jsonLogic } from 'jsonRules'
import { buttonRulesDisable } from './configRules'

export const configButtons = ({ useGlobalStore, key }) => {
    const { t } = useI18n()
    const rapidStore = useGlobalStore('rapidStore')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    return computed(() => {
        const tabsStore = useGlobalStore('tabs')

        const data = {
            selectedRows: selectedRows.value
        }

        return [
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Create'),
                disabled: !jsonLogic.apply(buttonRulesDisable.create, data),
                action () {
                    tabsStore.openTab({ name: 'CreateDispatch' })
                }
            },
            {
                icon: mdiPen,
                classType: 'primary',
                label: t('Edit'),
                disabled: !jsonLogic.apply(buttonRulesDisable.edit, data),
                action () {
                    tabsStore.openTab({ name: 'EditDispatch', params: { id: selectedRows.value[0].id } })
                }
            },
            {
                icon: mdiEye,
                classType: 'primary',
                label: t('Show'),
                disabled: !jsonLogic.apply(buttonRulesDisable.show, data),
                action () {
                    tabsStore.openTab({ name: 'ShowDispatch', params: { id: selectedRows.value[0].id } })
                }
            },
        ]
    })
}
