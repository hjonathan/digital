import {
    actionTextFace,
    checkboxFace,
    textFace
} from 'table'
import { useI18n } from 'vue-i18n'
import { comparatorFilterDate, formatDate } from 'shared'

/**
 * Column configuration object for AgGrid, uses the interfaces of the 'Table' library, we need to inject useGlobalStore to open other tabs.
 */
export const configColumns = ({ useGlobalStore, driverData, configSlideOver, actionView, idThread }) => {
    const { t } = useI18n()

    const data = [
        actionTextFace({
            field: 'name',
            headerName: t('Name'),
            pinned: 'left',
            action: (data) => {
                if (idThread) {
                    return
                }

                actionView.value.title = data.name

                driverData.value = data

                configSlideOver.value.open = !configSlideOver.value.open
            }
        }),
        textFace({
            field: 'phone',
            headerName: t('Phone')
        }),
        textFace({
            field: 'email',
            headerName: t('Email')
        }),
        textFace({
            field: 'certificate',
            headerName: t('Certificate')
        }),
        textFace({
            field: 'driver_license',
            headerName: t('Driver license')
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('License expiration date'),
            field: 'license_expiration_date',
            valueGetter: ({ data }) => {
                return data.license_expiration_date ? formatDate(data.license_expiration_date) : null
            },
            filterParams: {
                comparator: comparatorFilterDate
            },
            formatter: (data) => {
                return formatDate(data.start_date)
            }
        }),
        textFace({
            field: 'date_of_birth',
            headerName: t('Date of birth'),
            hide: true
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
            headerName: t('Updated at'),
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

    if (idThread) {
        data.unshift(
            checkboxFace({
                field: 'checkbox'
            })
        )
    }

    return data
}
