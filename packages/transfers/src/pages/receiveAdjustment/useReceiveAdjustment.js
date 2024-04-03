import { api } from '@/config'
import { getSessionJSON } from 'shared'

export const useReceiveAdjustment = ({ transferData, transferId, useGlobalStore }) => {
    const transfersStore = useGlobalStore('transfers')
    const dispatchesStore = useGlobalStore('dispatches')
    const inventoryStore = useGlobalStore('inventory')

    const acceptTransfer = async (transferId) => {
        const response = await api.post('/transfers/transfer_accept', formatTransferDataToApi())

        if (response.success) {
            updateStores()
        }

        return response
    }

    const formatTransferDataToApi = () => {
        const apiData = {
            id: transferData.value.id,
            origin_facility_id: getSessionJSON('facility_id'),
            traveled_route: '',
            destination_facility_id: transferData.value.destination_facility_id,
            vehicle_id: transferData.value.vehicle_id,
            transfer_item: transferData.value.item.map(item => ({
                item_id: item.id,
                quantity: item.quantity
            })),
            driver_id: transferData.value.driver_id,
            driver_id_2: transferData.value.driver_id_2,
            driver_id_3: transferData.value.driver_id_3,
            driver_id_4: transferData.value.driver_id_4
        }

        return apiData
    }

    const updateStores = () => {
        transfersStore.fetch()

        dispatchesStore.fetch()

        inventoryStore.fetch()
    }

    return {
        updateStores,
        acceptTransfer,
        formatTransferDataToApi
    }
}
