import {
    actionTextFace,
    textFace,
    checkboxFace
} from 'table'

import { useI18n } from 'vue-i18n'
import { formatDate, comparatorFilterDate, showUuid } from 'shared'

export const configColumns = ({ apiGrid, selectedRows, useGlobalStore }) => {
    const { t } = useI18n()

    return [
        checkboxFace({
            field: 'checkbox',
            headerName: ''
        }),
        actionTextFace({
            field: 'id',
            headerName: t('ID'),
            pinned: 'left',
            action: (data) => {

            },
            formatter: (data) => {
                return showUuid(data.id)
            }
        }),
        textFace({
            field: 'request_user',
            headerName: t('Request user'),
            formatter: (data) => {
                return data.request_user.name
            }
        }),
        textFace({
            field: 'department',
            headerName: t('Department'),
            formatter: (data) => {
                return data.request_user.department
            }
        }),
        textFace({
            field: 'supply_order_status',
            headerName: t('Supply order status'),
            formatter: (data) => {
                return data.supply_order_status.name
            }
        }),
        textFace({
            field: 'supply_order_type',
            headerName: t('supply_order_type'),
            formatter: (data) => {
                return data.supply_order_type.name
            }
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Updated at'),
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
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Created at'),
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
    ]
}
