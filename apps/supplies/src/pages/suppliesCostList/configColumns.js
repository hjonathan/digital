import {
    textFace,
    numericFace,
    quickActionFace
} from 'table'

import { formatDate, comparatorFilterDate, round } from 'shared'
import { useI18n } from 'vue-i18n'
import { QuickAction } from 'layout'
import { configQuickActions } from './configQuickActions'

export const configColumns = ({ apiGrid, selectedRows, useGlobalStore }) => {
    const { t } = useI18n()

    return [
        numericFace({
            field: 'quantity',
            headerName: t('Quantity'),
            valueGetter: ({ data }) => {
                return data.quantity
            },
            formatter: (data) => {
                return round(data.quantity)
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
            field: 'unit_cost',
            headerName: t('Unit cost'),
            aggFunc: 'sum',
            valueGetter: ({ data }) => {
                return data.unit_cost
            },
            formatter: (data) => {
                return data.unit_cost ? `$${data.unit_cost}` : '$0'
            }
        }),
        numericFace({
            field: 'cost',
            headerName: t('Total cost'),
            valueGetter: ({ data }) => {
                return data.cost
            },
            formatter: (data) => {
                return data.cost ? `$${data.cost}` : null
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
                return data.updated_at ? formatDate(data.updated_at, 'diffForHumans') : null
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
        quickActionFace({
            customComponent: QuickAction,
            options: {
                customButtons: ({ data }) => {
                    return configQuickActions({ data, useGlobalStore })
                }
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
