import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { 
    mdiRefresh,
    mdiPrinter
} from '@mdi/js'

export const configButtons = ({ selectedRows, thread, useGlobalStore, isLoading, useSuppliesCostList, getDataAfterFilter }) => {
    const { t } = useI18n()

    const suppliesCostStore = useGlobalStore('suppliesCost')

    const { isPrintButtonLoading } = useSuppliesCostList

    return computed(() => {
        return [
            {
                icon: mdiRefresh,
                classType: 'primary',
                label: t('Refresh'),
                isLoading: isLoading.value,
                disabled: isLoading.value,
                async action () {
                    isLoading.value = true

                    await suppliesCostStore.fetch()

                    isLoading.value = false
                }
            },
            {
                icon: mdiPrinter,
                classType: 'primary',
                label: t('Print'),
                disabled: isPrintButtonLoading.value,
                spinner: isPrintButtonLoading.value,
                async action () {
                    getDataAfterFilter()

                    await useSuppliesCostList.print()
                }
            },
        ]
    })
}
