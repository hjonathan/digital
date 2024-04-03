import {
    actionTextFace,
    textFace,
    checkboxFace,
    numericFace,
    badgeFace
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
        {
            cellRenderer: 'agGroupCellRenderer',
            field: null,
            headerName: null,
            sortable: false,
            floatingFilter: false,
            headerCheckboxSelection: false,
            suppressColumnsToolPanel: true,
            suppressFiltersToolPanel: true,
            hide: false,
            pinned: 'left',
            width: 20, // This cell only contains the checkbox, the minimum of 55 is visually pleasing
            maxWidth: 20, // This cell only contains the checkbox, the minimum of 55 is visually pleasing
            resizable: false,
            suppressMovable: true,
            suppressNavigable: true,
            menuTabs: [],
            headerCheckboxSelectionFilteredOnly: false,
            headerCheckboxSelectionCurrentPageOnly: false
        },
        textFace({
            field: 'name',
            headerName: t('Request user'),
            valueGetter: ({ data }) => {
                return data.request_user.name
            },
            formatter: (data) => {
                return data.request_user.name
            }
        }),
        textFace({
            field: 'trancking_id',
            headerName: t('Tracking ID'),
            valueGetter: ({ data }) => {
                return data.tracking_id
            },
            formatter: (data) => {
                return data.tracking_id
            }
        }),
        textFace({
            field: 'vendor',
            headerName: t('Vendor'),
            valueGetter: ({ data }) => {
                return data.vendor?.name
            },
            formatter: (data) => {
                return data.vendor?.name
            }
        }),
        numericFace({
            field: 'quantity',
            headerName: t('Supplies quantity'),
            valueGetter: ({ data }) => {
                return data.supply.length
            },
            formatter: (data) => {
                return data.supply.length
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

export const customProductColor = {
    warning: [0],
    success: [1]
}

export const getColor = (status) => {
    if (!status) return 'secondary'

    for (const key in customProductColor) {
        if (Object.hasOwnProperty.call(customProductColor, key)) {
            const element = customProductColor[key]

            if (element.includes(status || status)) return key
        }
    }

    return 'success'
}
