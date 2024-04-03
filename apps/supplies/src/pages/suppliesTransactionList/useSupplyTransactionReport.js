import { ref } from 'vue'
import { api } from '@/config'
import { useFormComponent } from 'form'
import { downloadBase64PDF } from 'shared'

export const useSupplyTransactionReport = () => {
    const isPrintButtonLoading = ref(false)

    const { finalStyles } = useFormComponent()

    const print = async () => {
        isPrintButtonLoading.value = true

        const printableArea = document.getElementById('supplyTransactionReportPrintableArea')

        const data = {
            data: printableArea.innerHTML,
            styles: finalStyles
        }

        const response = await api.post('pdf/manifest/create', data)

        response.success && downloadBase64PDF(response.data.content, `SupplyTransactionReport-${data.value?.id || '1000' }.pdf`)

        isPrintButtonLoading.value = false
    }

    return {
        isPrintButtonLoading,
        print
    }
}