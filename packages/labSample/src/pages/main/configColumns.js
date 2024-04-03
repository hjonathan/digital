import {
    actionTextFace,
    textFace,
    numericFace,
    checkboxFace
} from 'table'
import { showUuid, round } from 'shared'
import { useI18n } from 'vue-i18n'

/**
 * Column configuration object for AgGrid, uses the interfaces of the 'Table' library, we need to inject useGlobalStore to open other tabs.
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
            action: (data) => {},
            formatter: (data) => {
                return `${showUuid(data?.id)} ${data?.children_count ? `(${data?.children_count})` : ''}`
            }
        }),
        {
            field: 'lab_output',
            headerName: t('Lab Result'),
            cellRenderer: 'agGroupCellRenderer',
            showRowGroup: true,
            valueGetter: ({ data }) => {
                if (data.item_laboratory_results.length || data) {
                    return `Lab number # ${data.lab_result_number || ''}`
                }

                return ''
            }
        },
        {
            field: 'status',
            headerName: t('Status'),
            valueGetter: ({ data }) => {
                if (data.id_item && !data.id) {
                    return null
                }

                return data?.status?.name
            }
        },
        textFace({
            field: 'safety_result',
            headerName: 'Safety Result',
            formatter: (data) => {
                return data.safety_result
            }
        }),
        { field: 'total_cbd' },
        { field: 'total_thc', minWidth: 150 },
        { field: 'moisture', minWidth: 150 },
        textFace({
            field: 'batch_id',
            headerName: t('Batch ID'),
            formatter: (data) => {
                return `${showUuid(data?.batch_id)}`
            }
        }),

        textFace({
            field: 'item_type',
            headerName: t('Item type'),
            valueGetter: ({ data }) => {
                return data?.item_type?.name
            },
            formatter: (data) => {
                return data?.item_type?.name
            }
        }),
        textFace({
            field: 'stage',
            headerName: t('Stage'),
            valueGetter: ({ data }) => {
                return data?.stage?.name
            },
            formatter: (data) => {
                return data?.stage?.name
            }
        }),
        numericFace({
            field: 'quantity',
            headerName: t('Quantity'),
            valueGetter: ({ data }) => {
                return data?.quantity
            },
            formatter: (data) => {
                return data?.quantity ? round(data?.quantity) : ''
            }
        }),
        textFace({
            field: 'measure',
            headerName: t('Measure'),
            valueGetter: ({ data }) => {
                return data?.finished_good_type?.name ? data?.finished_good_type?.name : data?.measure?.name
            },
            formatter: (data) => {
                return data?.finished_good_type?.name ? data?.finished_good_type?.name : data?.measure?.name
            }
        }),
    ]

    return data
}
