import {
    actionTextFace,
    textFace,
    numericFace,
    checkboxFace,
    actionIconFace,
    quickActionFace
} from 'table'

import { lockReason } from '../configRules'
import { jsonLogic, lockRules } from 'jsonRules'

import { formatDate, showUuid, comparatorFilterDate, round } from 'shared'
import { useI18n } from 'vue-i18n'
import { QuickAction } from 'layout'
import { configQuickActions } from './configQuickActions'

/**
 * Column configuration object for AgGrid, uses the interfaces of the 'Table' library, we need to inject useGlobalStore to open other tabs.
 */
export const configColumns = ({ useGlobalStore, key, idThread }) => {
    const tabsStore = useGlobalStore('tabs')

    const { t } = useI18n()

    const data = [
        checkboxFace({
            field: 'checkbox'
        }),
        actionTextFace({
            field: 'id',
            headerName: t('ID'),
            pinned: 'left',
            action: (data) => {
                // Open the sublist when the child counter is greater than zero
                if (data.children_count && !idThread) {
                    tabsStore.openTab({ path: `/inventory/subitem/${data.id}`, params: { id: data.id } })
                }
            },
            formatter: (data) => {
                return `${showUuid(data.id)} ${data.children_count ? `(${data.children_count})` : ''}`
            }
        }),
        actionIconFace({
            field: 'lock_reason',
            headerName: 'Lock reason',
            params: {
                icon: (data) => {
                    return jsonLogic.apply(lockRules.lock, data) || (!data.item_lock_type && data.locked) ? lockReason[data.item_lock_type?.slug]?.icon : null
                },
                formatter: (data) => {
                    // Multiple locked reasons
                    if (!data.item_lock_type && data.locked) {
                        return t('Multiple locked reasons')
                    }

                    if (jsonLogic.apply(lockRules.lock, data) && data.item_lock_type) {
                        return lockReason[data.item_lock_type.slug] ? lockReason[data.item_lock_type.slug].formatter(data) : data.item_lock_type.name
                    }

                    return ''
                },
                color: (data) => {
                    if (jsonLogic.apply(lockRules.lock, data) && !idThread) {
                        return lockReason[data.item_lock_type?.slug || 'multiple-locked-reasons'].color
                    }

                    return ''
                },
                action: (data) => {
                    if (data.item_lock_type.slug === 'transfer-draft') {
                        const id = data.item_transfer_drafs[0]?.transfer_draft_id

                        tabsStore.openTab({
                            path: `/transfers/show/${id}`,
                            name: 'ShowTransfers',
                            params: { id }
                        })
                    }

                    if (data.invoice_draft_items?.length && !idThread) {
                        const id = data.invoice_draft_items[0]?.invoice_draft_id

                        tabsStore.openTab({
                            name: 'EditInvoice',
                            params: { id }
                        })
                    }
                }
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
            headerName: t('Unit of measure'),
            valueGetter: ({ data }) => {
                return data.finished_good_type?.name ? data.finished_good_type?.name : data.measure?.name
            },
            formatter: (data) => {
                return data.finished_good_type?.name ? data.finished_good_type?.name : data.measure?.name
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
            field: 'item_lock_type',
            headerName: t('Lock Type'),
            formatter: (data) => {
                return data.item_lock_type?.slug === 'unlock' ? `${t('None')}` : `${showUuid(data.item_lock_type?.name)}`
            }
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Stage start date'),
            field: 'start_date',
            valueGetter: ({ data }) => {
                return data.start_date ? formatDate(data.start_date) : null
            },
            filterParams: {
                comparator: comparatorFilterDate
            },
            formatter: (data) => {
                return formatDate(data.start_date, 'americanSimplifiedFormat')
            }
        }),
        numericFace({
            field: 'days_in_stage',
            headerName: t('Days in stage'),
            valueGetter: ({ data }) => {
                return data.days_in_stage
            },
            formatter: (data) => {
                return `${round(data.days_in_stage)} ${t('days')}`
            }
        }),
        numericFace({
            field: 'increase_quantity',
            headerName: t('Increase'),
            valueGetter: ({ data }) => {
                return data.increase_quantity
            },
            formatter: (data) => {
                return `${data.increase_quantity ? round(data.increase_quantity) : 0} ${data.measure ? data.measure.name : null}`
            }
        }),
        numericFace({
            field: 'decrease_quantity',
            headerName: t('Decrease'),
            valueGetter: ({ data }) => {
                return data.decrease_quantity
            },
            formatter: (data) => {
                return `${data.decrease_quantity ? round(data.decrease_quantity) : 0} ${data.measure ? data.measure.name : null}`
            }
        }),
        numericFace({
            field: 'waste_quantity',
            headerName: t('Waste'),
            valueGetter: ({ data }) => {
                return data.waste_quantity
            },
            formatter: (data) => {
                return `${data.waste ? round(data.waste) : 0} ${data.measure ? data.measure.name : null}`
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
                return data.item_type?.price
            },
            formatter: (data) => {
                return data.item_type.price ? `$${round(data.item_type.price)}` : `$${0}`
            }
        }),
        textFace({
            field: 'item_invoice_status',
            headerName: t('Item invoice status'),
            valueGetter: ({ data }) => {
                return data.item_invoice_status?.name
            },
            formatter: (data) => {
                return data.item_invoice_status?.name
            }
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Updated'),
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
            headerName: t('Name'),
            hide: true
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
        numericFace({
            field: 'cost',
            headerName: t('Cost'),
            hide: true,
            valueGetter: ({ data }) => {
                return data.cost
            },
            formatter: (data) => {
                return data.cost ? `$${round(data.cost)}` : `$${0}`
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
            headerName: t('Created'),
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
        quickActionFace({
            customComponent: QuickAction,
            options: {
                customButtons: ({ data }) => {
                    return configQuickActions({ data, useGlobalStore, key })
                }
            }
        }),
    ]

    return data
}

/**
 * Column configuration object for AgGrid, pivot table configuration for main inventory
 */
export const configPivotColumns = () => {
    const { t } = useI18n()

    const data = [
        {
            field: 'state',
            headerName: t('Stage'),
            default: true,
            filterable: true,
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            rowGroup: true,
            enableValue: true,
            valueGetter: ({ data }) => {
                return data && data.stage ? data.stage.name : null
            }
        },
        {
            field: 'category',
            headerName: t('Category'),
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            rowGroup: true,
            resizable: true,
            valueGetter: ({ data }) => {
                return data && data.category ? data.category.name : null
            }
        },
        {
            field: 'id',
            headerName: t('ID'),
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            rowGroup: true,
            enableValue: true,
            valueGetter: ({ data }) => {
                return data && data.id ? showUuid(data.id) : null
            }
        },
        {
            field: 'batch_id',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            headerName: t('Batch ID'),
            default: true,
            filterable: true,
            defaultAggFunc: 'sum'
        },
        {
            field: 'quantity',
            headerName: t('Quantity'),
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            default: true,
            filterable: true,
            aggFunc: 'sum',
            defaultAggFunc: 'sum',
            type: 'rightAligned'
        },
        {
            field: 'measure',
            headerName: t('Unit of measure'),
            default: true,
            filterable: true,
            enableRowGroup: true,
            defaultAggFunc: 'sum',
            enablePivot: true,
            resizable: true,
            enableValue: true,
            valueGetter: ({ data }) => {
                return data && data.measure ? data.measure.name : null
            }
        },
        {
            field: 'start_date',
            headerName: t('Start Date'),
            default: true,
            filterable: true,
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            valueGetter: ({ data }) => {
                return data && data.start_date ? formatDate(data.start_date) : null
            }
        },
        {
            field: 'days_in_stage',
            headerName: t('Days in stage'),
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            defaultAggFunc: 'sum',
            type: 'rightAligned'
        },
        {
            field: 'increase_quantity',
            headerName: t('Increase'),
            defaultAggFunc: 'sum',
            resizable: true,
            enableValue: true,
            aggFunc: 'sum',
            type: 'rightAligned'
        },
        {
            field: 'decrease_quantity',
            headerName: t('Decrease'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            aggFunc: 'sum',
            type: 'rightAligned'
        },
        {
            field: 'waste_quantity',
            headerName: t('Waste'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            aggFunc: 'sum',
            type: 'rightAligned'
        },
        {
            field: 'evaporation_quantity',
            headerName: t('Evaporation'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            aggFunc: 'sum',
            type: 'rightAligned'
        },
        {
            field: 'absorb_quantity',
            headerName: t('Absorb'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            aggFunc: 'sum',
            type: 'rightAligned'
        },
        {
            field: 'price',
            headerName: t('Price'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            aggFunc: 'sum',
            type: 'rightAligned'
        },
        {
            field: 'item_invoice_status',
            headerName: t('Item invoice status'),
            valueGetter: ({ data }) => {
                return data && data.item_invoice_status ? data.item_invoice_status.name : null
            },
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true
        },
        {
            field: 'updated_at',
            headerName: t('Updated'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            valueGetter: ({ data }) => {
                return data && data.updated_at ? formatDate(data.updated_at) : null
            }
        },
        {
            field: 'name',
            headerName: t('Name'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true
        },
        {
            field: 'brand',
            headerName: t('Brand'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            valueGetter: ({ data }) => {
                return data && data.brand ? data.brand.name : null
            }
        },
        {
            field: 'status',
            headerName: t('Status'),
            defaultAggFunc: 'sum',
            valueGetter: ({ data }) => {
                return data && data.status ? data.status.name : null
            },
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true
        },
        {
            field: 'location',
            headerName: t('Location'),
            defaultAggFunc: 'sum',
            valueGetter: ({ data }) => {
                return data && data.location ? data.location.name : null
            },
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true
        },
        {
            field: 'strain',
            headerName: t('Strain'),
            defaultAggFunc: 'sum',
            valueGetter: ({ data }) => {
                return data && data.strain ? data.strain.name : null
            },
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true
        },
        {
            field: 'type',
            headerName: t('Type'),
            defaultAggFunc: 'sum',
            valueGetter: ({ data }) => {
                return data && data.type ? data.type.name : null
            },
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true
        },
        {
            field: 'vendor_item_id',
            headerName: t('Vendor item ID'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true
        },
        {
            field: 'created_at',
            headerName: t('Created'),
            defaultAggFunc: 'sum',
            enableRowGroup: true,
            enablePivot: true,
            resizable: true,
            enableValue: true,
            valueGetter: ({ data }) => {
                return data && data.created_at ? formatDate(data.created_at) : null
            }
        },
    ]

    return data
}
