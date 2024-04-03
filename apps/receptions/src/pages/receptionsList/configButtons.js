import { mdiPlus, mdiEye } from '@mdi/js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore, selectedRows }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        return [
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Create'),
                disabled: selectedRows.value.length !== 0,
                action: () => {
                    tabsStore.openTab({ name: 'ReceptionCreate' })
                }
            },
            // {
            //     icon: mdiEye,
            //     classType: 'primary',
            //     label: t('Show'),
            //     disabled: selectedRows.value.length === 0,
            //     // spinner: loaders.value.save,
            //     action: async () => {
            //         tabsStore.openTab({ name: 'ReceptionShow', params: { id: selectedRows.value[0].id } })
            //     }
            // },
        ]
    })
}
