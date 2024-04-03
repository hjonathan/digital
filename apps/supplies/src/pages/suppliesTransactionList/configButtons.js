import { computed } from 'vue'
import { mdiRefresh, mdiPrinter } from '@mdi/js'
import { useI18n } from 'vue-i18n'

export const configButtons = ({ selectedRows, thread, useGlobalStore, isLoading, useSupplyList, getDataAfterFilter }) => {
    const { t } = useI18n()

    const suppliesTransactionStore = useGlobalStore('suppliesTransaction')

    const { isPrintButtonLoading } = useSupplyList

    return computed(() => {
        return [
            {
                icon: mdiRefresh,
                classType: 'primary',
                label: t('Refresh'),
                spinner: isLoading.value,
                disabled: isLoading.value,
                async action () {
                    isLoading.value = true

                    await suppliesTransactionStore.fetch()

                    isLoading.value = false
                }
            },
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                spinner: isPrintButtonLoading.value,
                disabled: isPrintButtonLoading.value,
                async action () {
                    getDataAfterFilter()

                    await useSupplyList.print()
                }
            },
        ]
    })
}

export const configButtonsItemReport = ({ useSupplyTransactionReport, isDataLoading }) => {
    const { t } = useI18n()

    const { isPrintButtonLoading } = useSupplyTransactionReport

    return computed(() => {
        return [
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                disabled: isPrintButtonLoading.value || isDataLoading.value,
                spinner: isPrintButtonLoading.value,
                async action () {
                    await useSupplyTransactionReport.print()
                }
            },
        ]
    })
}
