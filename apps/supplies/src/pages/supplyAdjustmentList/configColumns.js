import {
    actionTextFace,
    textFace,
    badgeFace,
    checkboxFace
} from 'table'
import { formatDate, comparatorFilterDate, showUuid } from 'shared'
import { useI18n } from 'vue-i18n'

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
            field: 'manager',
            headerName: t('Manager'),
            valueGetter: ({ data }) => {
                return data.request_user?.name
            },
            formatter: (data) => {
                return data.request_user?.name
            }
        }),
        textFace({
            field: 'process_type',
            headerName: t('Process type'),
            valueGetter: ({ data }) => {
                return data.supply_order_type?.name
            },
            formatter: (data) => {
                return data.supply_order_type?.name
            }
        }),
        badgeFace({
            headerName: t('Status'),
            field: 'status',
            valueGetter ({ data }) {
                return data.supply_order_status?.slug
            },
            params: {
                color: (data) => {
                    return getColor(data.supply_order_status?.slug)
                },
                formatter (data) {
                    return data.supply_order_status?.name
                }
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
            headerName: t('Requested'),
            field: 'requested_date',
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

export const badgesColors = {
    danger: ['rejected', 'cancel'],
    info: [],
    warning: ['requested', 'pending-warehouse-manager-approval', 'pending-department-manager-approval', 'pending-purchase-approval'],
    success: ['approved', 'attended'],
    orange: []
}

export const getColor = (status) => {
    if (!status) return 'secondary'

    for (const key in badgesColors) {
        if (Object.hasOwnProperty.call(badgesColors, key)) {
            const element = badgesColors[key]

            if (element.includes(status || status)) return key
        }
    }

    return 'success'
}
