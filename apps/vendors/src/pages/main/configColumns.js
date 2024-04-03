import {
    actionTextFace,
    textFace,
    checkboxFace
} from 'table'
import { formatDate, comparatorFilterDate } from 'shared'
import { useI18n } from 'vue-i18n'

export const configColumns = ({ apiGrid, selectedRows, useGlobalStore }) => {
    const { t } = useI18n()

    return [
        checkboxFace({
            field: 'checkbox',
            headerName: ''
        }),
        actionTextFace({
            field: 'name',
            headerName: t('Name'),
            pinned: 'left',
            action: (data) => {

            },
            formatter: (data) => {
                return data.name
            }
        }),
        textFace({
            field: 'email',
            headerName: t('Email'),
            valueGetter: ({ data }) => {
                return data.email
            }
        }),
        textFace({
            field: 'phone',
            headerName: t('Phone'),
            valueGetter: ({ data }) => {
                return data.phone
            }
        }),
        textFace({
            field: 'address',
            headerName: t('Address'),
            valueGetter: ({ data }) => {
                return data.address
            }
        }),
        textFace({
            field: 'city',
            headerName: t('City'),
            valueGetter: ({ data }) => {
                return data.city
            }
        }),
        textFace({
            field: 'state',
            headerName: t('State'),
            valueGetter: ({ data }) => {
                return data.state
            }
        }),
        textFace({
            field: 'zip_code',
            headerName: t('Zip'),
            valueGetter: ({ data }) => {
                return data.zip_code
            }
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Last modified'),
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
}
