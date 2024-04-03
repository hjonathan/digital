import { computed } from 'vue'
import { mdiEye } from '@mdi/js'
import { useI18n } from 'vue-i18n'

export const configButtons = ({ selectedRows, thread, useGlobalStore }) => {
    const { t } = useI18n()
    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        return [
            {
                icon: mdiEye,
                classType: 'primary',
                label: t('Review to dispatch'),
                disabled: selectedRows.value.length === 0,
                action () {
                    tabsStore.openTab({ name: 'ShowDispatchNote', params: { id: selectedRows.value[0].id } })
                }
            },
        ]
    })
}
