import { computed } from 'vue'
import { mdiPlus, mdiPencil } from '@mdi/js'
import { useI18n } from 'vue-i18n'

export const configButtons = ({ useSlideOver, selectedRows, thread, useGlobalStore }) => {
    const { t } = useI18n()

    const { setConfig, configSlideOver, data, setOnAfterSave } = useSlideOver

    if (thread.value.idThread) return threadButtons({ useSlideOver, selectedRows, thread, useGlobalStore })

    return computed(() => {
        return [
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Create'),
                disabled: selectedRows.value.length !== 0,
                action () {
                    selectedRows.value = []
                    data.value = selectedRows.value

                    setConfig({
                        action: 'Create',
                        open: !configSlideOver.value.open
                    })

                    setOnAfterSave('Create', () => {
                        selectedRows.value = []
                        data.value = selectedRows.value
                    })
                }
            },
            {
                icon: mdiPencil,
                classType: 'primary',
                label: t('Edit'),
                disabled: !selectedRows.value.length,
                action () {
                    data.value = selectedRows.value[0]

                    setConfig({
                        action: 'Edit',
                        open: !configSlideOver.value.open
                    })

                    setOnAfterSave('Edit', () => {
                        selectedRows.value = []
                        data.value = selectedRows.value
                    })
                }
            },
        ]
    })
}

export const threadButtons = ({ useSlideOver, selectedRows, thread, useGlobalStore }) => {
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
