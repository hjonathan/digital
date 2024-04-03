import { comparatorFilterDate, formatDate, showUuid } from 'shared'
import { textFace, actionTextFace, numericFace, checkboxFace } from 'table'
import { useI18n } from 'vue-i18n'

/**
 * Column Settings for Home Page Transfers
 * @returns
 */
export const configColumns = ({ useGlobalStore }) => {
    const { t } = useI18n()

    return [
        checkboxFace({
            headerCheckboxSelection: false
        }),
        actionTextFace({
            headerName: t('ID'),
            field: 'id',
            formatter (data) {
                return showUuid(data.id)
            },
            valueGetter (data) {
                return data.id
            }
        }),
        textFace({
            headerName: t('Status'),
            field: 'status',
            formatter (data) {
                return data.transfer_status?.slug
            },
            valueGetter (data) {
                return data.transfer_status?.slug
            }
        }),
        textFace({
            headerName: t('Origin'),
            field: 'origin',
            formatter (data) {
                return data.origin_facility?.facility_name
            },
            valueGetter (data) {
                return data.origin_facility?.facility_name
            }
        }),
        textFace({
            headerName: t('Destination'),
            field: 'destination',
            formatter (data) {
                return data.destination_facility?.facility_name
            },
            valueGetter (data) {
                return data.destination_facility?.facility_name
            }
        }),
        textFace({
            headerName: t('Route'),
            field: 'traveled_route',
            formatter (data) {
                return data.traveled_route
            },
            valueGetter (data) {
                return data.traveled_route
            }
        }),
        textFace({
            headerName: t('Updated at'),
            field: 'updated_at',
            filter: 'agDateColumnFilter',
            filterParams: {
                comparator: comparatorFilterDate
            },
            valueGetter (data) {
                return data.updated_at ? formatDate(data.updated_at) : null
            },
            formatter (data) {
                return formatDate(data.updated_at, 'diffForHumans')
            }
        }),
    ]
}
