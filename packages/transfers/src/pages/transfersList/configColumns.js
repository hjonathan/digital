import { comparatorFilterDate, formatDate, showUuid, round } from 'shared'
import { textFace, actionTextFace, checkboxFace, badgeFace, numericFace } from 'table'
import { useI18n } from 'vue-i18n'
import { getBadgeColor } from '../configColors'

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
        badgeFace({
            headerName: t('Status'),
            field: 'status',
            valueGetter ({ data }) {
                return data.transfer_status?.name
            },
            params: {
                color: (data) => {
                    return getBadgeColor(data)
                },
                formatter (data) {
                    return data.transfer_status?.name
                }
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
        numericFace({
            headerName: t('Total items'),
            field: 'total_items',
            formatter (data) {
                return data.item_transfers?.length
            },
            valueGetter ({ data }) {
                return data.item_transfers?.length
            }
        }),
        numericFace({
            headerName: t('Total cost'),
            field: 'total_cost',
            formatter (data) {
                return getTotalCost(data.item_transfers)
            },
            valueGetter ({ data }) {
                return getTotalCost(data.item_transfers)
            }
        }),
        textFace({
            headerName: t('Last modified'),
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

export const getTotalCost = (itemsTransfer) => {
    let cotalCost = 0

    for (const item of itemsTransfer) {
        cotalCost += (item.cost * item.quantity) || 0
    }

    return round(cotalCost)
}
