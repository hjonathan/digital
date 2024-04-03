import {
    textFace,
    numericFace,
    checkboxFace,
    actionTextFace
} from 'table'

import { formatDate, comparatorFilterDate, round } from 'shared'
import { useI18n } from 'vue-i18n'

/**
 * Column configuration object for AgGrid, uses the interfaces of the 'Table' library, we need to inject useGlobalStore to open other tabs.
 */
export const configColumns = ({ useGlobalStore }) => {
    const { t } = useI18n()

    const data = [
        checkboxFace({
            headerCheckboxSelection: false
        }),
        actionTextFace({
            field: 'name',
            headerName: t('Name'),
            pinned: 'left'
        }),
        numericFace({
            field: 'width',
            headerName: t('Width'),
            valueGetter: ({ data }) => {
                return data.width
            },
            formatter: (data) => {
                return round(data.width)
            }
        }),
        numericFace({
            field: 'height',
            headerName: t('Height'),
            valueGetter: ({ data }) => {
                return data.height
            },
            formatter: (data) => {
                return round(data.height)
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

    return data
}
