import { ref, inject } from 'vue'
import { useFormComponent } from 'form'
import { api } from '@/config'
import { downloadBase64PDF } from 'shared'

export const useUnknownSuppliesList = () => {
    const isPrintButtonLoading = ref(false)
    const { finalStyles } = useFormComponent()

    const useGlobalStore = inject('useGlobalStore')
    const processStore = useGlobalStore('process')
    const unknownSuppliesStore = useGlobalStore('unknownSupplies')

    const configModal = ref({
        title: null,
        description: null,
        confirmButtonLabel: null,
        confirm: null,
        confirmation: null,
        showAlert: false,
        modelData: ''
    })

    const print = async () => {
        isPrintButtonLoading.value = true

        const timeToWaitSyncData = 300

        setTimeout(async () => {
            const printableArea = document.getElementById('unknownSupplyListPrintableArea')

            const data = {
                data: printableArea.innerHTML,
                styles: finalStyles
            }

            const response = await api.post('/pdf/manifest/create', data)

            response.success && downloadBase64PDF(response.data.content, `Unknown supplies list-${data.value?.id || '1000'}.pdf`)

            isPrintButtonLoading.value = false
        }, timeToWaitSyncData)
    }

    const sync = () => {
        unknownSuppliesStore.fetch()

        processStore.fetch()
    }

    return {
        isPrintButtonLoading,
        print,
        sync,
        configModal
    }
}
