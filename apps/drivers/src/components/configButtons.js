import { useI18n } from 'vue-i18n'
import { mdiPlus, mdiInboxArrowDown } from '@mdi/js'
import { computed } from 'vue'

export const configButtons = ({ useGlobalStore, driverData, driversSelected, key, configSlideOver, actionView, idThread, actionThread }) => {
    if (!idThread) return defaultButtons({ driverData, configSlideOver, actionView })

    return transfersButtons({ useGlobalStore, key, driversSelected, actionThread, idThread })
}

/**
 * Buttons when: NOTHING is selected
 */
export const defaultButtons = ({ driverData, configSlideOver, actionView }) => {
    const { t } = useI18n()

    return [
        {
            icon: mdiPlus,
            classType: 'primary',
            label: t('Create'),
            action: () => {
                actionView.value.title = t('Create')

                driverData.value = {}

                configSlideOver.value.open = !configSlideOver.value.open
            }
        },
    ]
}

/**
 * Buttons when: Transfer is open this drivers table
 */
export const transfersButtons = ({ useGlobalStore, key, driversSelected, actionThread, idThread }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    const selectedRows = rapidStore.reactiveProperty(`selected-${key}-rows`)

    return computed(() => {
        return [
            {
                icon: mdiInboxArrowDown,
                classType: 'teal',
                label: selectedRows.value.length === 1 ? t('Add driver') : t('Add drivers'),
                disabled: !selectedRows.value.length,
                rows: `selected-${key}-rows`,
                reactive: selectedRows.value,
                action () {
                    rapidStore.$emitGlobalEvent(`selectedDrivers:${idThread}`, selectedRows.value)

                    tabsStore.closeTab(`${actionThread}Drivers`)
                }
            },
        ]
    })
}
