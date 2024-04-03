import {
    actionTextFace,
    textFace,
    numericFace,
    checkboxFace,
    quickActionFace,
    actionIconFace
} from 'table'
import { formatDate, showUuid, comparatorFilterDate, round } from 'shared'
import { useI18n } from 'vue-i18n'
import { QuickAction } from 'layout'
import { configQuickActions } from './configQuickActions'
import { lockReason } from '../configRules'
import { jsonLogic, lockRules } from 'jsonRules'
import { mdiLockOutline } from '@mdi/js'

/**
 * Columns configuration for Inventory subitem
 * @returns Array
 */
export const configColumns = ({ useGlobalStore, key }) => {
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
            },
            formatter: (data) => {
                return `${showUuid(data.id)} ${data.children_count ? `(${data.children_count})` : ''}`
            }
        }),
        /**
         * Interface for text and conditional icon
         */
        actionIconFace({
            field: 'lock_reason',
            headerName: 'Lock reason',
            params: {
                icon: (data) => {
                    return jsonLogic.apply(lockRules.lock, data) || (data.item_lock_type && lockReason[data.item_lock_type.slug]) ? mdiLockOutline : null
                },
                formatter: (data) => {
                    // Multiple locked reasons
                    if (!data.item_lock_type && data.locked) {
                        return t('Multiple locked reasons')
                    }

                    if (jsonLogic.apply(lockRules.lock, data) && data.item_lock_type) {
                        return lockReason[data.item_lock_type.slug] ? lockReason[data.item_lock_type.slug].formatter(data) : data.item_lock_type.name
                    }

                    return ' '
                },
                color: (data) => {
                    if (jsonLogic.apply(lockRules.lock, data)) {
                        return lockReason[data.item_lock_type?.slug || 'multiple-locked-reasons'].color
                    }

                    return ''
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
            headerName: t('Measure'),
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
                return `${showUuid(data.item_lock_type?.name)}`
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
                return data.item_type?.price
            },
            formatter: (data) => {
                return data.item_type.price ? round(data.item_type.price) : ''
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
        quickActionFace({
            customComponent: QuickAction,
            options: {
                customButtons: (data) => {
                    return configQuickActions({ data, useGlobalStore, key })
                }
            }
        }),
    ]

    return data
}
