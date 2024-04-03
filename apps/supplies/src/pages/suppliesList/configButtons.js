import { computed } from 'vue'
import { mdiPencil, mdiPlus, mdiChartBar, mdiRefresh, mdiCogSync } from '@mdi/js'
import { useI18n } from 'vue-i18n'

export const configButtons = ({ selectedRows, thread, useGlobalStore, useSlideOver, isLoading, apiGrid }) => {
    const { t } = useI18n()

    const coreStore = useGlobalStore('core')
    const tabsStore = useGlobalStore('tabs')
    const suppliesStore = useGlobalStore('supplies')

    const { configSlideOver, action, data } = useSlideOver

    return computed(() => {
        return [
            {
                icon: mdiRefresh,
                classType: 'primary',
                label: t('Refresh supplies list'),
                disabled: selectedRows.value.length > 0,
                async action () {
                    isLoading.value = true

                    suppliesStore.fetch().then(() => {
                        isLoading.value = false
                    }).catch(() => {
                        isLoading.value = false
                    })
                }
            },
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Create'),
                permission: 'supplies.supplies.create',
                disabled: selectedRows.value.length > 0,
                action () {
                    action.value = 'Save'

                    data.value = {}

                    data.value.title = t('Create supply')

                    configSlideOver.value.open = !configSlideOver.value.open
                }
            },
            {
                icon: mdiPencil,
                classType: 'primary',
                label: t('Edit'),
                permission: 'supplies.supplies.edit',
                disabled: selectedRows.value.length === 0,
                action () {
                    action.value = 'Save'

                    data.value.title = selectedRows.value[0]?.name

                    data.value = selectedRows.value[0]

                    configSlideOver.value.open = !configSlideOver.value.open
                }
            },
            {
                icon: mdiChartBar,
                classType: 'primary',
                label: t('Show transactions'),
                permission: 'supplies.transactions.show',
                disabled: selectedRows.value.length === 0,
                action () {
                    tabsStore.openTab({ name: 'ItemTransactions', params: { id: selectedRows.value[0]?.id } })

                    apiGrid.value?.deselectAll()
                }
            },
            {
                icon: mdiCogSync,
                classType: 'primary',
                label: t('New supply adjustment'),
                permission: 'supplies.adjustment.create',
                disabled: selectedRows.value.length === 0,
                action () {
                    tabsStore.openTab({ name: 'CreateSupplyAdjustment', params: { id: selectedRows.value[0]?.id } })

                    apiGrid.value?.deselectAll()
                }
            },
        ]
    })
}
