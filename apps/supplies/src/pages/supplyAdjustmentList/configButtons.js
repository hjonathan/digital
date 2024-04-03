import { computed } from 'vue'
import { mdiRefresh, mdiEye } from '@mdi/js'
import { useI18n } from 'vue-i18n'

export const configButtons = ({ selectedRows, thread, useGlobalStore, isLoading }) => {
    const { t } = useI18n()
    const supplyAdjustmentStore = useGlobalStore('supplyAdjustment')
    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        return [
            {
                icon: mdiRefresh,
                classType: 'primary',
                label: t('Refresh adjustments list'),
                disabled: selectedRows.value.length > 0,
                async action () {
                    isLoading.value = true

                    supplyAdjustmentStore.fetch().then(() => {
                        isLoading.value = false
                    }).catch(() => {
                        isLoading.value = false
                    })
                }
            },
            {
                icon: mdiEye,
                classType: 'primary',
                label: t('Show adjustment'),
                permission: 'supplies.adjustment.show',
                disabled: selectedRows.value.length !== 1,
                async action () {
                    tabsStore.openTab({ name: 'ShowSupplyAdjustment', params: { id: selectedRows.value[0].id } })
                }
            },
        ]
    })
}
