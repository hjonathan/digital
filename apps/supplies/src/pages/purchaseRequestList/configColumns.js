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
            field: 'requester',
            headerName: t('Requester'),
            valueGetter: ({ data }) => {
                return data.request_user?.name
            },
            formatter: (data) => {
                return data.request_user?.name
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
            field: 'aproval_user',
            headerName: t('Approval user'),
            valueGetter: ({ data }) => {
                return data.approval_user?.name
            },
            formatter: (data) => {
                return data.approval_user?.name
            }
        }),

        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Requested'),
            field: 'requested_date',
            valueGetter: ({ data }) => {
                return data.requested_date ? formatDate(data.requested_date) : null
            },
            filterParams: {
                comparator: comparatorFilterDate
            },
            formatter: (data) => {
                return formatDate(data.requested_date, 'diffForHumans')
            }
        }),
    ]
}

export const badgesColors = {
    danger: ['rejected'],
    info: [],
    warning: ['requested'],
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
