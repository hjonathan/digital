import { mdiSend, mdiCheck, mdiCancel, mdiPrinter } from '@mdi/js'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { api } from '@/config'
import { cloneDeep } from 'lodash'

const MAX_COST = 5000

/**
 * Button configuration for main Labels table
 * @param {*} param
 * @returns
 */
export const configButtons = ({ useGlobalStore, useAlertModal, useMaterialAssign, configModal }) => {
    const { t } = useI18n()
    const coreStore = useGlobalStore('core')

    const rapidStore = useGlobalStore('rapidStore')
    const suppliesStore = useGlobalStore('supplies')

    const tabsStore = useGlobalStore('tabs')

    const materialRequestStore = useGlobalStore('materialRequest')

    const processStore = useGlobalStore('process')

    return computed(() => {
        const { data, schema, errors, isPrintButtonLoading, formatApiData, getTotalCostSupplies, isValidQuantities, loadings, gridErrors } = useMaterialAssign

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
                    await useMaterialAssign.print()
                }
            },

            // MANAGER
            {
                icon: mdiCancel,
                classType: 'red',
                label: t('Reject'),
                show: schema.value.role === 'manager',
                action () {
                    // Modal confirmation for confirmations
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await apiMaterialAssingManager({ useGlobalStore, useAlertModal, useMaterialAssign, t }, { note, approval: false })

                        return response
                    }

                    // Show confirmation modal
                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Reject material assignment?')
                    configModal.value.confirmButtonLabel = t('Yes, reject it')
                    configModal.value.note = true
                    configModal.value.type = 'danger'

                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiCheck,
                classType: 'primary',
                label: t('Approve'),
                show: schema.value.role === 'manager',
                action () {
                    // Modal confirmation for confirmations API:
                    configModal.value.confirmation = async ({ note }) => {
                        const response = await apiMaterialAssingManager({ useGlobalStore, useAlertModal, useMaterialAssign, t }, { note, approval: true, editable: data.value.editable })

                        return response
                    }

                    // Show confirmation modal
                    configModal.value.title = t('Confirmation')
                    configModal.value.description = t('Approve material assignment?')
                    configModal.value.confirmButtonLabel = t('Yes, approve it')
                    configModal.value.type = 'primary'
                    configModal.value.showAlert = true
                }
            },
            {
                icon: mdiSend,
                classType: 'primary',
                label: t('Assign'),
                show: schema.value.role === 'creator',
                disabled: loadings.value.submit || !isValidQuantities.value,
                spinner: loadings.value.submit,
                async action () {
                    suppliesStore.fetch()

                    const { totalCost } = await getTotalCostSupplies()

                    if (totalCost) {
                        configModal.value.modelData.requireManagerApproval = totalCost >= MAX_COST

                        configModal.value.modelData.create_dispatch = totalCost < MAX_COST || coreStore.getPermissions().includes('supplies.adjustment.unrestricted_approval_amount')

                        // Modal confirmation for confirmations
                        configModal.value.confirmation = async () => {
                            const apiData = formatApiData(data.value)

                            const response = await api.post('/supplies/material_assignment_build', apiData)

                            if (response.success) {
                                rapidStore.$emitGlobalEvent('updateSupplyDashboard')

                                tabsStore.closeTab('StartMaterialAssign')

                                materialRequestStore.fetch()

                                processStore.fetch()
                            }

                            if (response.errors || !response.success) {
                                rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

                                errors.value = response.errors
                            }

                            suppliesStore.fetch()
                        }

                        // Show confirmation modal
                        configModal.value.title = t('Confirmation')
                        configModal.value.description = t('Are you sure to assign the materials?')
                        configModal.value.confirmButtonLabel = t('Yes, assign')
                        configModal.value.type = 'primary'

                        console.log('SHOW MESSAGE ======')
                        console.log('FROM gridErrors.value.length:', gridErrors.value.length)

                        if (!gridErrors.value.length) configModal.value.showAlert = true
                    }
                }
            },
        ]
    })
}

export const apiMaterialAssingManager = async ({ useGlobalStore, useAlertModal, useMaterialAssign, t }, { note, approval, editable }) => {
    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')
    const materialRequestStore = useGlobalStore('materialRequest')
    const processStore = useGlobalStore('process')

    const { data, errors, variables } = useMaterialAssign

    const sync = () => {
        materialRequestStore.fetch()
        processStore.fetch()
        rapidStore.$emitGlobalEvent('updateSupplyDashboard')
    }

    const response = await api.post('/supplies/material_assignment_change_status', {
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

        tabsStore.closeTab('ShowMaterialAssign')
    }

    if (response.errors || !response.success) {
        rapidStore.$emitGlobalEvent('globalAlert:show', { type: 'danger', content: t(response.message) })

        sync()

        errors.value = response.errors

        return {
            errors: {
                message: t(response.message)
            }
        }
    }
}
