import { computed } from 'vue'
import { mdiEye, mdiPlus } from '@mdi/js'
import { useI18n } from 'vue-i18n'

export const configButtons = ({ selectedRows, thread, useGlobalStore }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        return [
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Create'),
                disabled: selectedRows.value.length !== 0,
                action () {
                    tabsStore.openTab({ name: 'CreateRequestForQuotation' })
                }
            },
            {
                icon: mdiEye,
                classType: 'primary',
                label: t('Show'),
                disabled: selectedRows.value.length === 0,
                action () {
                    tabsStore.openTab({ name: 'ShowRequestForQuotation', params: { id: selectedRows.value[0].id } })
                }
            },
        ]
    })
}
