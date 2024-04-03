import {
    actionTextFace,
    textFace,
    numericFace,
    quickActionFace,
    checkboxFace
} from 'table'

import { formatDate, showUuid, comparatorFilterDate, round } from 'shared'
import { useI18n } from 'vue-i18n'
import { QuickAction } from 'layout'
import { configQuickActions } from './configQuickActions'

/**
 * Column configuration object for AgGrid, uses the interfaces of the 'Table' library, we need to inject useGlobalStore to open other tabs.
 */
export const configColumns = ({ useGlobalStore, key }) => {
    const tabsStore = useGlobalStore('tabs')

    const { t } = useI18n()

    const data = [
        checkboxFace({
            field: 'checkbox',
            headerName: ''
        }),
        actionTextFace({
            field: 'id',
            headerName: t('ID'),
            pinned: 'left',
            action: (data) => {
                // if (data.invoice_status.slug === 'draft') {
                //     tabsStore.openTab({
                //         path: `invoicing/edit/${data.id}`,
                //         params: { id: data.id },
                //         name: 'EditInvoice'
                //     })
                // }

                // if (data.invoice_status.slug === 'invoiced') {
                //     tabsStore.openTab({
                //         path: `invoicing/show/${data.id}`,
                //         params: { id: data.id },
                //         name: 'ShowInvoice'
                //     })
                // }
            },
            formatter: (data) => {
                return `${showUuid(data.id)} ${data.children_count ? `(${data.children_count})` : ''}`
            }
        }),
        textFace({
            field: 'company_name',
            headerName: t('Company name')
        }),
        textFace({
            field: 'invoice_status',
            headerName: t('Invoice status'),
            valueGetter: ({ data }) => {
                return data.invoice_status?.name
            },
            formatter: (data) => {
                return data.invoice_status?.name
            }
        }),
        textFace({
            field: 'address',
            headerName: t('Address')
        }),
        textFace({
            field: 'address_2',
            headerName: t('Address 2'),
            hide: true
        }),
        textFace({
            field: 'city',
            headerName: t('City')
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Created at'),
            field: 'created_at',
            hide: true,
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
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Updated at'),
            field: 'updated_at',
            hide: true,
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
        numericFace({
            field: 'discount',
            headerName: t('Discount'),
            hide: true,
            valueGetter: ({ data }) => {
                return data.discount
            },
            formatter: (data) => {
                return round(data.discount)
            }
        }),
        textFace({
            field: 'phone',
            headerName: t('Phone'),
            hide: true
        }),
        textFace({
            field: 'shipping_address',
            headerName: t('Shipping address'),
            hide: true
        }),
        textFace({
            field: 'shipping_address_2',
            headerName: t('Shipping address'),
            hide: true
        }),
        textFace({
            field: 'shipping_city',
            headerName: t('Shipping city'),
            hide: true
        }),
        numericFace({
            field: 'shipping_cost',
            headerName: t('Shipping cost'),
            valueGetter: ({ data }) => {
                return data.shipping_cost
            },
            formatter: (data) => {
                return round(data.shipping_cost)
            }
        }),
        textFace({
            field: 'shipping_name',
            headerName: t('Shipping name'),
            hide: true
        }),
        textFace({
            field: 'shipping_phone',
            headerName: t('Shipping phone'),
            hide: true
        }),
        textFace({
            field: 'shipping_state',
            headerName: t('Shipping state'),
            hide: true
        }),
        textFace({
            field: 'shipping_zip_code',
            headerName: t('Shipping zip_code'),
            hide: true
        }),
        textFace({
            field: 'state',
            headerName: t('state'),
            hide: true
        }),
        textFace({
            field: 'taxpayer_identification_number',
            headerName: t('Taxpayer identification number'),
            hide: true
        }),
        numericFace({
            field: 'total',
            headerName: t('Total'),
            valueGetter: ({ data }) => {
                return data.total
            },
            formatter: (data) => {
                return round(data.total)
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
