import {
    mdiFilterVariant,
    mdiGrid
} from '@mdi/js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Button configuration for default table component
 * @param {*} param
 * @returns
 */
export const configButtons = ({ configTable, openToolPanel }) => {
    const { t } = useI18n()
    return computed(() => {
        return configTable.value.headerButtons().concat([
            {
                icon: mdiGrid,
                classType: 'gray',
                label: t('Columns'),
                action () {
                    openToolPanel('columns')
                }
            },
            {
                icon: mdiFilterVariant,
                classType: 'gray',
                label: t('Filters'),
                disabled: configTable.value.pivotMode,
                action () {
                    openToolPanel('filters')
                }
            },
        ])
    })
}
