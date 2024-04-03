import { computed } from 'vue'
import { mdiEye, mdiPlus, mdiRefresh, mdiPackageVariantClosedPlus } from '@mdi/js'
import { useI18n } from 'vue-i18n'

export const configButtons = ({ selectedRows, thread, useGlobalStore, isLoading }) => {
    const { t } = useI18n()
    const tabsStore = useGlobalStore('tabs')
    const processStore = useGlobalStore('process')

    return computed(() => {
        return [
            {
                icon: mdiRefresh,
                classType: 'primary',
                label: t('Refresh process list'),
                disabled: selectedRows.value.length > 0,
                async action () {
                    isLoading.value = true

                    processStore.fetch().then(() => {
                        isLoading.value = false
                    }).catch(() => {
                        isLoading.value = false
                    })
                }
            },
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Start material request'),
                disabled: selectedRows.value.length > 0,
                permission: 'supplies.material_request.create',
                action () {
                    tabsStore.openTab({ name: 'CreateMaterialRequest' })
                }
            },
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Start purchase request'),
                disabled: selectedRows.value.length > 0,
                permission: 'supplies.purchase_request.create',
                action () {
                    tabsStore.openTab({ name: 'CreatePurchaseRequest' })
                }
            },
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Receive by invoice'),
                permission: 'supplies.invoice.create',
                disabled: selectedRows.value.length > 0,
                action () {
                    tabsStore.openTab({ name: 'SuppliesCreateInvoice' })
                }
            },
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Initiate purchase order'),
                permission: 'supplies.purchase_order.create',
                disabled: selectedRows.value.length > 0,
                action () {
                    tabsStore.openTab({ name: 'CreatePurchaseOrder' })
                }
            },
            {
                icon: mdiPlus,
                classType: 'primary',
                label: t('Assign materials'),
                permission: 'supplies.material_assignment.create',
                disabled: selectedRows.value.length > 0,
                action () {
                    tabsStore.openTab({ name: 'StartMaterialAssign' })
                }
            },
            {
                icon: mdiPackageVariantClosedPlus,
                classType: 'primary',
                label: t('Receive items'),
                // permission: 'supplies.material_assignment.create',
                disabled: selectedRows.value.length > 0,
                action () {
                    tabsStore.openTab({ name: 'CreateReceipt' })
                }
            },
            {
                icon: mdiEye,
                classType: 'primary',
                label: t('Show'),
                disabled: selectedRows.value.length === 0,
                action () {
                    tabsStore.openTab({ name: 'ShowProcess', params: { id: selectedRows.value[0].id } })
                }
            },
        ]
    })
}
