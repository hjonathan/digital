import { computed } from 'vue'
import { mdiPlus, mdiPen, mdiEye, mdiDownload, mdiCancel, mdiCog } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { jsonLogic, genericRules } from 'jsonRules'
// import { buttonRulesDisable } from './configRules'

/**
 * Home Page Transfer Button Settings
 * @returns
 */
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
                icon: mdiEye,
                classType: 'primary',
                label: t('Show'),
                disabled: !jsonLogic.apply(genericRules.oneSelected, data),
                action () {
                    tabsStore.openTab({ name: 'ShowTransfers', params: { id: selectedRows.value[0].id } })
                }
            },
        ]
    })
}
