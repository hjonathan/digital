import {
    textFace,
    actionTextFace,
    checkboxFace,
    numericFace
} from 'table'
import { formatDate, comparatorFilterDate, showUuid } from 'shared'
import { useI18n } from 'vue-i18n'

/**
 * Column configuration object for AgGrid, uses the interfaces of the 'Table' library, we need to inject useGlobalStore to open other tabs.
 */
export const configColumns = ({ useGlobalStore, openDeleteConfirmationModal }) => {
    const { t } = useI18n()

    const data = [
        checkboxFace({
            field: 'checkbox',
            headerName: ' '
        }),
        actionTextFace({
            field: 'id',
            headerName: t('ID'),
            valueGetter ({ data }) {
                return data.id
            },
            formatter (data) {
                return showUuid(data.id)
            }
        }),
        textFace({
            field: 'reception_document_number',
            headerName: t('Document number'),
            valueGetter ({ data }) {
                return data.reception_document_number
            },
            formatter (data) {
                return data.reception_document_number
            }
        }),
        numericFace({
            field: 'total_price',
            headerName: t('Total price'),
            valueGetter ({ data }) {
                return `$${totalPrice(data)}`
            },
            formatter (data) {
                return `$${totalPrice(data)}`
            }
        }),
        numericFace({
            field: 'total_items',
            headerName: t('Total items'),
            valueGetter ({ data }) {
                return data.item_receptions.length
            },
            formatter (data) {
                return data.item_receptions.length
            }
        }),
        textFace({
            filter: 'agDateColumnFilter',
            headerName: t('Received at'),
            field: 'received_at',
            valueGetter: ({ data }) => {
                return data.received_at ? formatDate(data.received_at) : null
            },
            filterParams: {
                comparator: comparatorFilterDate
            },
            formatter: (data) => {
                return formatDate(data.received_at, 'diffForHumans')
            }
        }),
        textFace({
            field: 'vendor',
            headerName: t('Vendor'),
            valueGetter ({ data }) {
                return data.vendor?.name
            },
            formatter (data) {
                return data.vendor?.name
            }
        }),
        textFace({
            field: 'address',
            headerName: t('Address'),
            hide: true,
            valueGetter ({ data }) {
                return data.address
            },
            formatter (data) {
                return data.address
            }
        }),
        textFace({
            field: 'phone',
            headerName: t('Phone'),
            hide: true,
            valueGetter ({ data }) {
                return data.phone
            },
            formatter (data) {
                return data.phone
            }
        }),
        textFace({
            field: 'city',
            headerName: t('City'),
            hide: true,
            valueGetter ({ data }) {
                return data.city
            },
            formatter (data) {
                return data.city
            }
        }),
        textFace({
            field: 'state',
            headerName: t('State'),
            hide: true,
            valueGetter ({ data }) {
                return data.state
            },
            formatter (data) {
                return data.state
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
    ]

    return data
}

export const totalPrice = (reception) => {
    return reception.item_receptions.reduce((accumulator, item) => {
        return accumulator + item.price
    }, 0)
}

export const totalItems = (reception) => {
    return reception.item_receptions.reduce((accumulator, item) => {
        return accumulator + item.price
    }, 0)
}
