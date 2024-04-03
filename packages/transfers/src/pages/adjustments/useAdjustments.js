import { api } from '@/config'
import { useI18n } from 'vue-i18n'

export const useReceiveAdjustment = ({ items, transferData, transferId, useGlobalStore }) => {
    const { t } = useI18n()

    const transfersStore = useGlobalStore('transfers')
    const inventoryStore = useGlobalStore('inventory')
    const tabsStore = useGlobalStore('tabs')
    const rapidStore = useGlobalStore('rapidStore')

    const formatTransferDataToApi = () => {
        const data = {
            id: transferData.value.id,
            origin_facility_id: transferData.value.origin_facility_id,
            destination_facility_id: transferData.value.destination_facility_id,
            driver_id: transferData.value.driver_id,
            vehicle_id: transferData.value.vehicle_id,
            traveled_route: transferData.value.traveled_route,
            completed_at: transferData.value.completed_at,
            departured_on: transferData.value.departured_on,
            arrived_on: transferData.value.arrived_on,
            received_at: transferData.value.received_at,
            received_id: transferData.value.received_id,
            transfer_item: items.value.map(e =>
                ({
                    item_id: e.id,
                    cost: e.price,
                    quantity: e.quantity,
                    item_transfer_type_id: e.item_transfer_type_id
                })
            )
        }

        return data
    }

    const updateStores = () => {
        transfersStore.fetch()

        inventoryStore.fetch()
    }

    const transferReceiveAdjust = async () => {
        const data = formatTransferDataToApi()

        const response = await api.postWithAlert('/transfers/transfer_receive_adjust', data)

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjustment successful ') })

            const transferTabs = tabsStore.getTabs('Adjustments')

            const editTransferTab = transferTabs.find(tab => tab.name === 'Adjustments' && tab.params.id === transferId)

            updateStores()

            tabsStore.closeTab('Adjustments')

            editTransferTab && tabsStore.closeTab('Receive')
        }

        return response
    }

    const transferAdjustmentApproved = async () => {
        const data = formatTransferDataToApi()

        const response = await api.postWithAlert('/transfers/transfer_adjustment_approved', data)

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjustment approved successful ') })

            updateStores()
        }

        return response
    }

    const transferAdjustmentRejected = async () => {
        const data = formatTransferDataToApi()

        const response = await api.postWithAlert('/transfers/transfer_adjustment_rejected', data)

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjustment rejected successful ') })

            updateStores()
        }

        return response
    }

    const acceptItemFound = async (id) => {
        const data = {
            id
        }

        const response = await api.postWithAlert('/transfers/transfer_item_found_receive', data)

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjustment rejected successful ') })

            updateStores()
        }

        return response
    }

    const rejectItemFound = async (id) => {
        const data = {
            id
        }

        const response = await api.postWithAlert('/transfers/transfer_item_found_reject', data)

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjustment rejected successful ') })

            updateStores()
        }

        return response
    }

    const cancelAdjust = async (id) => {
        const data = {
            id,
            cancel: true
        }

        const response = await api.postWithAlert('/transfers/transfer_cancel_adjust', data)

        if (response.success) {
            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t('Adjustment canceled successful ') })

            updateStores()
        }

        return response
    }

    return {
        transferReceiveAdjust,
        transferAdjustmentApproved,
        transferAdjustmentRejected,
        updateStores,
        acceptItemFound,
        rejectItemFound,
        cancelAdjust
    }
}
