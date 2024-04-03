import { mdiSend, mdiCheck, mdiCancel, mdiPrinter } from '@mdi/js'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
import { cloneDeep } from 'lodash'
import { formatDate } from 'shared'

import ApproveModal from './ApproveModal.vue'
import RejectModal from './RejectModal.vue'

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore, useAlertModal, useMaterialRequest, configModal }) => {
    const { t } = useI18n()

    /*     const { showAlert, configModal } = useAlertModal */

    const rapidStore = useGlobalStore('rapidStore')

    const tabsStore = useGlobalStore('tabs')

    const materialRequestStore = useGlobalStore('materialRequest')

    const processStore = useGlobalStore('process')

    return computed(() => {
        const { data, schema, errors, isPrintButtonLoading } = useMaterialRequest

        return [
            // Print
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                show: schema.value.role === 'show',
                disabled: isPrintButtonLoading.value,
                spinner: isPrintButtonLoading.value,
                async action () {
                    await useMaterialRequest.print()
                }
            },

            // MANAGER
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject'),
                show: schema.value.role === 'manager' || schema.value.role === 'warehouse',
                action () {
                    // Modal confirmation for confirmations
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await apiMaterialRequestManager({ useGlobalStore, useAlertModal, useMaterialRequest, t }, { note, approval: false })

                        return response
                    }

                    configModal.value.title = t('Reject material request?')
                    configModal.value.confirmButtonLabel = t('Yes, reject it')
                    configModal.value.note = true
                    configModal.value.type = 'danger'
                    configModal.value.component = shallowRef(RejectModal)

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiCheck,
                classType: 'primary',
                label: t('Approve'),
                show: schema.value.role === 'manager' || schema.value.role === 'warehouse',
                action () {
                    // Modal confirmation for confirmations API:
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await apiMaterialRequestManager({ useGlobalStore, useAlertModal, useMaterialRequest, t }, { note, approval: true, editable: data.value.editable })

                        return response
                    }

                    configModal.value.title = t('Approve material request?')
                    configModal.value.confirmButtonLabel = t('Yes, approve it')
                    configModal.value.note = true
                    configModal.value.component = shallowRef(ApproveModal)
                    configModal.value.type = 'primary'

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiSend,
                classType: 'primary',
                label: t('Submit'),
                show: schema.value.role === 'creator',
                action () {
                    configModal.value.confirmation = async () => {
                        const apiData = formatData(data.value)

                        const response = await api.post('/supplies/material_request_build', apiData)

                        if (response.success) {
                            rapidStore.$emitGlobalEvent('updateSupplyDashboard')

                            tabsStore.closeTab('CreateMaterialRequest')

                            materialRequestStore.fetch()

                            processStore.fetch()
                        }

                        if (response.errors || !response.success) {
                            rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                            errors.value = response.errors
                        }
                    }

                    // Show confirmation modal
                    configModal.value.title = t('Submit material request?')
                    configModal.value.confirmButtonLabel = t('Yes, submit it')

                    configModal.value.showAlert = true
                }
            },
        ]
    })
}

export const formatData = (object) => {
    return {
        requested_delivery_date: object.deliveryInformation.requested_delivery_date ? formatDate(object.deliveryInformation.requested_delivery_date, 'utcDateTime') : null,
        note: object.note,
        instructions: object.deliveryInformation?.instructions,
        requisition_supplies: object.requisition_supplies.map(e => {
            const element = cloneDeep(e)

            delete element.measure

            delete element.supply

            return element
        })
    }
}

export const apiMaterialRequestManager = async ({ useGlobalStore, useAlertModal, useMaterialRequest, t }, { note, approval, editable }) => {
    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')
    const materialRequestStore = useGlobalStore('materialRequest')
    const processStore = useGlobalStore('process')

    const { data, schema, errors, variables } = useMaterialRequest

    const sync = () => {
        materialRequestStore.fetch()
        processStore.fetch()
        rapidStore.$emitGlobalEvent('updateSupplyDashboard')
    }

    const response = await api.post('/supplies/material_request_change_status', {
        id: data.value.id,
        approval,
        ...variables.value,
        note_approval_or_reject: note.value,
        requisition_supplies: !editable
            ? null
            : data.value?.requisition_supplies?.map(e => {
                const element = cloneDeep(e)

                delete element.measure
                delete element.supply
                delete element.pivot

                return element
            })
    })

    if (response.success) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'success', content: t(response.message) })

        sync()

        tabsStore.closeTab('ShowMaterialRequest')
    }

    if (response.errors || !response.success) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

        sync()

        errors.value = response.errors

        if (response.errors?.note_approval_or_reject) {
            return {
                errors: {
                    message: t(response.message)
                }
            }
        }
    }
}
