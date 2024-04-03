import { ref } from 'vue'
import { api } from '@/config'
import { downloadBase64PDF } from 'shared'
import { useFormComponent } from 'form'

export const useSupplyList = () => {
    const isPrintButtonLoading = ref(false)

    const { finalStyles } = useFormComponent()

    const print = async () => {
        isPrintButtonLoading.value = true

        const timeToWaitTemplateRendering = 300

        setTimeout(async () => {
            const printableArea = document.getElementById('suppliesTransactionReportPrintableArea')

            const data = {
                data: printableArea.innerHTML,
                styles: finalStyles 
            }

            const response = await api.post('/pdf/manifest/create', data)

            response.success && downloadBase64PDF(response.data.content, `SuppliesTransactionsReport-${data.value?.id || '1000'}.pdf`)

            isPrintButtonLoading.value = false
        }, timeToWaitTemplateRendering)
    }

    return {
        isPrintButtonLoading,
        print
    }
}