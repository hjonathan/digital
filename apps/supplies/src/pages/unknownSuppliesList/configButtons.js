import { computed, nextTick, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    mdiPencil,
    mdiPackageVariantClosedPlus,
    mdiReceiptTextSendOutline,
    mdiSourceMerge,
    mdiRefresh,
    mdiFileDocumentCheck,
    mdiPrinter
} from '@mdi/js'
import { api } from '@/config'
import { CreateProcessWarehouseInvoiceModal } from './modals'

export const configButtons = ({ selectedRows, thread, useGlobalStore, useSlideOver, isLoading, apiGrid, useUnknownSuppliesList, getDataAfterFilter, tableData }) => {
    const { t } = useI18n()

    const coreStore = useGlobalStore('core')
    const tabsStore = useGlobalStore('tabs')
    const rapidStore = useGlobalStore('rapidStore')

    const unknownSuppliesStore = useGlobalStore('unknownSupplies')

    const { configSlideOver, action, data, setOnAfterSave } = useSlideOver

    const { isPrintButtonLoading, configModal, sync } = useUnknownSuppliesList

    if (thread.value.idThread) {
        return threadButtons({ selectedRows, thread, useGlobalStore, useSlideOver, isLoading, apiGrid, useUnknownSuppliesList, getDataAfterFilter, tableData })
    }

    return computed(() => {
        return [
            {
                icon: mdiRefresh,
                classType: 'primary',
                label: t('Refresh list'),
                disabled: selectedRows.value.length > 0,
                async action () {
                    isLoading.value = true

                    unknownSuppliesStore.fetch().then(() => {
                        isLoading.value = false
                    }).catch(() => {
                        isLoading.value = false
                    })
                }
            },
            {
                icon: mdiPackageVariantClosedPlus,
                classType: 'primary',
                label: t('Receive items'),
                permission: 'supplies.supplies.create',
                disabled: selectedRows.value.length > 0,
                action () {
                    tabsStore.openTab({ name: 'CreateReceipt' })
                }
            },
            {
                icon: mdiPencil,
                classType: 'primary',
                label: t('Update information'),
                permission: 'supplies.supplies.edit',
                disabled: selectedRows.value.length !== 1,
                action () {
                    action.value = 'Save'

                    data.value = selectedRows.value[0]

                    data.value.title = selectedRows.value[0]?.name

                    configSlideOver.value.open = !configSlideOver.value.open
                }
            },
            // Print
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                // disabled: isPrintButtonLoading.value || selectedRows.value.length > 0 || !tableData.value.length,
                disabled: true,
                spinner: isPrintButtonLoading.value,
                async action () {
                    tableData.value.length && getDataAfterFilter()

                    await useUnknownSuppliesList.print()
                }
            },
        ]
    })
}

export const threadButtons = ({ selectedRows, thread, useGlobalStore, useSlideOver, isLoading, apiGrid, useUnknownSuppliesList, getDataAfterFilter, tableData }) => {
    const { t } = useI18n()

    const rapidStore = useGlobalStore('rapidStore')
    const tabsStore = useGlobalStore('tabs')

    return computed(() => {
        return [
            {
                icon: mdiPackageVariantClosedPlus,
                classType: 'primary',
                label: t('Add receipt'),
                disabled: selectedRows.value.length === 0,
                async action () {
                    rapidStore.$emitGlobalEvent(`selectedItems:${thread.value.action}`, selectedRows.value)

                    tabsStore.closeTab('UnknownSuppliesList')
                }
            },
        ]
    })
}

export const validationCreateProcess = (selectedRows) => {
    if (selectedRows.length === 0) { return false }

    const vendorId = selectedRows[0].vendor?.id
    const response = selectedRows.every(e => {
        return e.vendor && e.vendor?.id === vendorId
    })

    return !!response
}
