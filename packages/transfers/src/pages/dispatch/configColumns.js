import { comparatorFilterDate, formatDate, showUuid } from 'shared'
import { textFace, actionTextFace, numericFace, checkboxFace, badgeFace } from 'table'
import { useI18n } from 'vue-i18n'
import { getBadgeColor } from '../configColors'

// Column Settings for Dispatch table
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
                    return data.dispatch_transfer_status?.name
                }
            }
        }),
        numericFace({
            headerName: t('Vehicle'),
            field: 'vehicle_id',
            formatter (data) {
                return `${data.vehicle?.make} ${data.vehicle?.model} , ${data.vehicle?.license_plate}`
            },
            valueGetter (data) {
                return `${data.vehicle?.make} ${data.vehicle?.model} , ${data.vehicle?.license_plate}`
            }
        }),
        textFace({
            headerName: t('Driver'),
            field: 'driver',
            formatter (data) {
                return data.driver?.map(e => e.name).join(' , ')
            },
            valueGetter (data) {
                return data.driver?.map(e => e.name).join(' , ')
            }
        }),
        numericFace({
            headerName: t('Total items'),
            field: 'total_items',
            formatter (data) {
                return getItemsCount(data.dispatch_transfer_details)
            },
            valueGetter ({ data }) {
                return getItemsCount(data.dispatch_transfer_details)
            }
        }),
        numericFace({
            headerName: t('Total transfers'),
            field: 'total_transfers',
            formatter (data) {
                return getTransfersCount(data.dispatch_transfer_details)
            },
            valueGetter ({ data }) {
                return getTransfersCount(data.dispatch_transfer_details)
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

export const getTransfersCount = (transfers) => {
    const transfersCount = transfers.filter(transfer => transfer.transfer)

    return transfersCount.length
}

export const getItemsCount = (transfers) => {
    const transfersCount = transfers.filter(transfer => transfer.transfer)

    let itemsCount = 0

    for (const transfer of transfersCount) {
        if (transfer.transfer) itemsCount += transfer.transfer?.item?.length || 0
    }

    return itemsCount
}
