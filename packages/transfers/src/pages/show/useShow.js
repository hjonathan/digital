import { inject, ref } from 'vue'
import { getSessionJSON } from 'shared'
import { api } from '@/config'

export const useShow = ({ tab }) => {
    const showConfirmRejectModal = ref(false)
    const showConfirmAcceptModal = ref(false)

    const globalTransferData = ref({})

    const receptionForm = ref()

    const actionView = ref({})

    const configSlideOver = ref({
        open: false,
        close: false,
        disableButton: false,
        buttonLabel: null
    })

    const formatGlobalTransferData = () => {
        const apiData = {
            id: globalTransferData.value.id,
            origin_facility_id: getSessionJSON('facility_id'),
            traveled_route: '',
            destination_facility_id: globalTransferData.value.destination_facility_id,
            vehicle_id: globalTransferData.value.vehicle_id,
            transfer_item: globalTransferData.value.item.map(item => ({
                item_id: item.id,
                quantity: item.quantity
            })),
            driver_id: globalTransferData.value.driver_id,
            driver_id_2: globalTransferData.value.driver_id_2,
            driver_id_3: globalTransferData.value.driver_id_3,
            driver_id_4: globalTransferData.value.driver_id_4
        }

        return apiData
    }

    return {
        formatGlobalTransferData,
        globalTransferData,
        receptionForm,
        showConfirmRejectModal,
        showConfirmAcceptModal,
        actionView,
        configSlideOver
    }
}
