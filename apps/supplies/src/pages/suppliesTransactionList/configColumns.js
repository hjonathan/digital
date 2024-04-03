import {
    textFace,
    numericFace,
    quickActionFace
} from 'table'

import { formatDate, comparatorFilterDate } from 'shared'
import { useI18n } from 'vue-i18n'
import { QuickAction } from 'layout'
import { configQuickActions } from './configQuickActions'

export const configColumns = ({ apiGrid, selectedRows, useGlobalStore }) => {
    const { t } = useI18n()

    return [
        numericFace({
            field: 'quantity',
            headerName: t('In'),
            cellStyle: { color: '#4CAF50' },
            valueGetter: ({ data }) => {
                return data.inQuantity
            },
            formatter: (data) => {
                return data.inQuantity
            }
        }),
        numericFace({
            field: 'quantity',
            headerName: t('Out'),
            cellStyle: { color: '#F44336' },
            valueGetter: ({ data }) => {
                return data.outQuantity
            },
            formatter: (data) => {
                return data.outQuantity
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
            cellStyle: ({ data }) => {
                if (data.type === 'IN') return { color: '#4CAF50' }

                if (data.type === 'OUT') return { color: '#F44336' }

                return { color: '#212121' }
            },
            valueGetter: ({ data }) => {
                return data.unit_cost
            },
            formatter: (data) => {
                return data.unit_cost ? `$${data.unit_cost}` : null
            }
        }),
        numericFace({
            field: 'cost',
            headerName: t('Total cost'),
            cellStyle: ({ data }) => {
                if (data.type === 'IN') return { color: '#4CAF50' }

                if (data.type === 'OUT') return { color: '#F44336' }

                return { color: '#212121' }
            },
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
