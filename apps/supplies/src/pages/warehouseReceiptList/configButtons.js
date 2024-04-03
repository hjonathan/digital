import { computed } from 'vue'
import { mdiPlus, mdiEye } from '@mdi/js'
import { useI18n } from 'vue-i18n'

export const configButtons = ({ selectedRows, thread, useGlobalStore }) => {
    const { t } = useI18n()

    const tabsStore = useGlobalStore('tabs')

    if (thread.value.idThread) return threadButtons({ selectedRows, thread, useGlobalStore })

    return computed(() => {
        return [
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Create'),
                disabled: selectedRows.value.length !== 0,
                action () {
                    tabsStore.openTab({ name: 'CreateWarehouseReceipt' })
                }
            },
            {
                icon: mdiEye,
                classType: 'primary',
                label: t('Show'),
                disabled: !selectedRows.value.length,
                action () {
                    tabsStore.openTab({ name: 'ShowWarehouseReceipt', params: { id: selectedRows.value[0]?.id } })
                }
            },
        ]
    })
}

export const threadButtons = ({ selectedRows, thread, useGlobalStore }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        return [
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t(`Add to ${thread.value.action}`),
                disabled: !selectedRows.value.length,
                action () {
                    rapidStore.$emitGlobalEvent(`selectedRows:${thread.value.idThread}`, selectedRows)

                    tabsStore.closeTab(`${thread.value.idThread}`)
                }
            },
        ]
    })
}
