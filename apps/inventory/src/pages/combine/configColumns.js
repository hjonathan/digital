import {
    textFace,
    numericFace,
    checkboxFace
} from 'table'

import { formatDate, showUuid, comparatorFilterDate, round } from 'shared'
import { useI18n } from 'vue-i18n'

/**
 * Column configuration object for AgGrid, uses the interfaces of the 'Table' library, we need to inject useGlobalStore to open other tabs.
 */
export const configColumns = () => {
    const { t } = useI18n()

    const data = [
        checkboxFace({
            field: 'checkbox'
        }),
        textFace({
            field: 'id',
            headerName: t('ID'),
            pinned: 'left',
            formatter: (data) => {
                return `${showUuid(data.id)}`
            }
        }),
        textFace({
            field: 'batch_id',
            headerName: t('Batch ID'),
            formatter: (data) => {
                return `${showUuid(data.batch_id)}`
            }
        }),
        textFace({
            field: 'item_type',
            headerName: t('Item type'),
            valueGetter: ({ data }) => {
                return data.item_type?.name
            },
            formatter: (data) => {
                return data.item_type?.name
            }
        }),
        textFace({
            field: 'status',
            headerName: t('Status'),
            valueGetter: ({ data }) => {
                return data.status?.name
            },
            formatter: (data) => {
                return data.status?.name
            }
        }),
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
        textFace({
            field: 'stage',
            headerName: t('Stage'),
            valueGetter: ({ data }) => {
                return data.stage?.name
            },
            formatter: (data) => {
                return data.stage?.name
            }
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Start date'),
            field: 'start_date',
            valueGetter: ({ data }) => {
                return data.start_date ? formatDate(data.start_date) : null
            },
            filterParams: {
                comparator: comparatorFilterDate
            },
            formatter: (data) => {
                return formatDate(data.start_date, 'diffForHumans')
            }
        }),
        numericFace({
            field: 'days_in_stage',
            headerName: t('Days in stage'),
            valueGetter: ({ data }) => {
                return data.days_in_stage
            },
            formatter: (data) => {
                return round(data.days_in_stage)
            }
        }),
        numericFace({
            field: 'increase_quantity',
            headerName: t('Increase'),
            valueGetter: ({ data }) => {
                return data.increase_quantity
            },
            formatter: (data) => {
                return round(data.increase_quantity)
            }
        }),
        numericFace({
            field: 'decrease_quantity',
            headerName: t('Decrease'),
            valueGetter: ({ data }) => {
                return data.decrease_quantity
            },
            formatter: (data) => {
                return round(data.decrease_quantity)
            }
        }),
        numericFace({
            field: 'waste_quantity',
            headerName: t('Waste'),
            valueGetter: ({ data }) => {
                return data.waste_quantity
            },
            formatter: (data) => {
                return round(data.waste_quantity)
            }
        }),
        numericFace({
            field: 'evaporation_quantity',
            headerName: t('Evaporation'),
            valueGetter: ({ data }) => {
                return data.evaporation_quantity
            },
            formatter: (data) => {
                return round(data.evaporation_quantity)
            }
        }),
        numericFace({
            field: 'absorb_quantity',
            headerName: t('Absorb'),
            valueGetter: ({ data }) => {
                return data.absorb_quantity
            },
            formatter: (data) => {
                return round(data.absorb_quantity)
            }
        }),
        numericFace({
            field: 'price',
            headerName: t('Price'),
            valueGetter: ({ data }) => {
                return data.price
            },
            formatter: (data) => {
                return round(data.price)
            }
        }),
        textFace({
            field: 'item_invoice_status',
            headerName: t('Invoice status'),
            valueGetter: ({ data }) => {
                return data.item_invoice_status?.name
            },
            formatter: (data) => {
                return data.item_invoice_status?.name
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
            field: 'name',
            headerName: t('Name')
        }),
        textFace({
            field: 'brand',
            headerName: t('Brand'),
            hide: true,
            valueGetter: ({ data }) => {
                return data.brand?.name
            },
            formatter: (data) => {
                return data.brand?.name
            }
        }),
        textFace({
            field: 'location',
            headerName: t('Location'),
            hide: true,
            valueGetter: ({ data }) => {
                return data.location?.name
            },
            formatter: (data) => {
                return data.location?.name
            }
        }),
        textFace({
            field: 'strain',
            headerName: t('Strain'),
            hide: true,
            valueGetter: ({ data }) => {
                return data.strain?.name
            },
            formatter: (data) => {
                return data.strain?.name
            }
        }),
        textFace({
            field: 'type',
            headerName: t('Type'),
            hide: true,
            valueGetter: ({ data }) => {
                return data.type?.name
            },
            formatter: (data) => {
                return data.type?.name
            }
        }),
        textFace({
            field: 'vendor_item_id',
            headerName: t('Vendor item ID'),
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
    ]

    return data
}
