import {
    actionTextFace,
    numericFace,
    textFace
} from 'table'
import { useI18n } from 'vue-i18n'
import { comparatorFilterDate, formatDate } from 'shared'

/**
 * Column configuration object for AgGrid, uses the interfaces of the 'Table' library, we need to inject useGlobalStore to open other tabs.
 */
export const configColumns = ({ useGlobalStore, vehicleData, configSlideOver, actionView, idThread, actionThread }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    const data = [
        actionTextFace({
            field: 'license_plate',
            headerName: t('License plate'),
            pinned: 'left',
            action: (data) => {
                if (idThread) {
                    rapidStore.$emitGlobalEvent(`selectedVehicle:${idThread}`, data)

                    tabsStore.closeTab(`${actionThread}Vehicles`)

                    return
                }

                actionView.value.title = data.certificate

                vehicleData.value = data

                configSlideOver.value.open = !configSlideOver.value.open
            }
        }),
        textFace({
            field: 'make',
            headerName: t('Make')
        }),
        textFace({
            field: 'color',
            headerName: t('Color')
        }),
        textFace({
            field: 'year',
            headerName: t('Year')
        }),
        textFace({
            field: 'model',
            headerName: t('Model')
        }),
        numericFace({
            field: 'passengers',
            headerName: t('Passengers')
        }),
        numericFace({
            field: 'engine_capacity',
            headerName: t('Engine capacity')
        }),
        textFace({
            field: 'certificate',
            headerName: t('Certificate')
        }),
        textFace({
            field: 'vin',
            headerName: t('Vin')
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Created at'),
            hide: true,
            field: 'created_at',
            valueGetter: ({ data }) => {
                return data.created_at ? formatDate(data.created_at) : null
            },
            filterParams: {
                comparator: comparatorFilterDate
            },
            formatter: (data) => {
                return formatDate(data.created_at, 'diffForHumans')
            }
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Uodated at'),
            hide: true,
            field: 'updated_at',
            valueGetter: ({ data }) => {
                return data.updated_at ? formatDate(data.updated_at) : null
            },
            filterParams: {
                comparator: comparatorFilterDate
            },
            formatter: (data) => {
                return formatDate(data.updated_at, 'diffForHumans')
            }
        }),
    ]

    return data
}
