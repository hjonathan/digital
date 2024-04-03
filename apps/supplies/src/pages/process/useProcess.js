import { inject, ref, shallowRef } from 'vue'
import { api } from '@/config'
import { useI18n } from 'vue-i18n'

import CancelModal from './CancelModal.vue'
import FinishModal from './FinishModal.vue'

export const useProcess = ({ configModal }) => {
    const { t } = useI18n()
    const useGlobalStore = inject('useGlobalStore')

    const rapidStore = useGlobalStore('rapidStore')
    const processStore = useGlobalStore('process')
    const suppliesCostStore = useGlobalStore('suppliesCost')
    const suppliesTransactionStore = useGlobalStore('suppliesTransaction')

    const process = ref()

    const isLoading = ref(false)

    const cancelProcess = () => {
        configModal.value.template = 'cancelProcess'

        configModal.value.confirmation = async ({ note }) => {
            const response = await api.post('/supplies/process_cancel', {
                note: note.value,
                process_id: process.value.id
            })

            if (response.errors || !response.success) {
                rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                return {
                    errors: {
                        message: t(response.message)
                    }
                }
            }

            if (response.success) {
                rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

                rapidStore.$emitGlobalEvent('updateSupplyDashboard')

                processStore.fetch()

                suppliesCostStore.fetch()

                suppliesTransactionStore.fetch()
            }

            return response
        }

        configModal.value.title = t('Confirmation')
        configModal.value.description = t('Request and all related data will be deleted. Are you sure to cancel the process?')
        configModal.value.confirmButtonLabel = t('Accept')
        configModal.value.note = true
        configModal.value.type = 'danger'
        configModal.value.component = shallowRef(CancelModal)

        configModal.value.showAlert = true
    }

    const terminateProcess = () => {
        configModal.value.template = 'terminateProcess'

        configModal.value.confirmation = async ({ note }) => {
            const response = await api.post('/supplies/process_terminate', {
                note: note.value,
                process_id: process.value.id
            })

            if (response.errors || !response.success) {
                rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                return {
                    errors: {
                        message: t(response.message)
                    }
                }
            }

            if (response.success) {
                rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })
                rapidStore.$emitGlobalEvent('updateSupplyDashboard')

                processStore.fetch()
            }

            return response
        }

        configModal.value.title = t('Confirmation')
        configModal.value.description = t('Are you sure to finish the receiving process?')
        configModal.value.confirmButtonLabel = t('Finish')
        configModal.value.note = true
        configModal.value.type = 'danger'
        configModal.value.component = shallowRef(FinishModal)

        configModal.value.showAlert = true
    }

    return {
        process,
        cancelProcess,
        isLoading,
        terminateProcess,
        configModal
    }
}
