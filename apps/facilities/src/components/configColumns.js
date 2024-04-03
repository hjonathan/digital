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
export const configColumns = ({ useGlobalStore, facilityData, configSlideOver, actionView, idThread }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    const data = [
        actionTextFace({
            field: 'facility_name',
            headerName: t('Facility name'),
            pinned: 'left',
            action: (data) => {
                if (idThread) {
                    rapidStore.$emitGlobalEvent(`selectedFacility:${idThread}`, data)

                    tabsStore.closeTab('transferFacilities')

                    return
                }

                actionView.value.title = data.facility_name

                facilityData.value = data

                configSlideOver.value.open = !configSlideOver.value.open
            }
        }),
        textFace({
            field: 'address',
            headerName: t('Address')
        }),
        textFace({
            field: 'address_2',
            headerName: t('Address 2'),
            hide: true
        }),
        textFace({
            field: 'country',
            headerName: t('Country'),
            valueGetter: ({ data }) => {
                return data.country?.name
            },
            formatter: (data) => {
                return data.country?.name
            }
        }),
        textFace({
            field: 'city',
            headerName: t('City')
        }),
        textFace({
            field: 'email',
            headerName: t('Email')
        }),
        textFace({
            field: 'contact_name',
            headerName: t('Contact name'),
            hide: true
        }),
        numericFace({
            field: 'phone',
            headerName: t('Phone')
        }),
        textFace({
            field: 'state',
            headerName: t('State')
        }),
        textFace({
            field: 'website',
            headerName: t('Website')
        }),
        numericFace({
            field: 'zip_code',
            headerName: t('Zip code')
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