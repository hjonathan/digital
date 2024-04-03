import {
    actionTextFace,
    textFace,
    checkboxFace,
    numericFace
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
            field: 'name',
            headerName: t('Name'),
            valueGetter: ({ data }) => {
                return data.name
            },
            formatter: (data) => {
                return data.name
            }
        }),
        textFace({
            field: 'quantity',
            headerName: t('Quantity'),
            valueGetter: ({ data }) => {
                return data.quantity
            },
            formatter: (data) => {
                return data.quantity
            }
        }),
        textFace({
            field: 'category',
            headerName: t('Category'),
            valueGetter: ({ data }) => {
                return data.category?.name
            },
            formatter: (data) => {
                return data.category?.name
            }
        }),
        textFace({
            field: 'location',
            headerName: t('Location'),
            valueGetter: ({ data }) => {
                return data.location?.name
            },
            formatter: (data) => {
                return data.location?.name
            }
        }),
        textFace({
            field: 'measure',
            headerName: t('Measure'),
            valueGetter: ({ data }) => {
                return data.measure?.name
            },
            formatter: (data) => {
                return data.measure?.name
            }
        }),
        numericFace({
            field: 'reference_price',
            headerName: t('Reference price'),
            valueGetter: ({ data }) => {
                return data.reference_price
            },
            formatter: (data) => {
                return data.reference_price
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

export const badgesColors = {
    danger: ['rejected'],
    info: [],
    warning: ['requested', 'pending-warehouse-manager-approval', 'pending-department-manager-approval'],
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
