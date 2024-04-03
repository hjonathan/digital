import { ref } from 'vue'
import { api } from '@/config'
import { downloadBase64PDF } from 'shared'
import { useFormComponent } from 'form'

export const useSuppliesCostList = () => {
    const { finalStyles } = useFormComponent()

    const isPrintButtonLoading = ref(false)

    const print = async () => {
        isPrintButtonLoading.value = true

        const timeToWaitTemplateRendering = 300

        setTimeout(async () => {
            const printableArea = document.getElementById('suppliesCostPrintableArea')

            const data = {
                data: printableArea.innerHTML,
                styles: finalStyles
            }

            const response = await api.post('pdf/manifest/create', data)

            response.success && downloadBase64PDF(response.data.content, `SC-${data.value?.id || '1000'}.pdf`)

            isPrintButtonLoading.value = false
        }, timeToWaitTemplateRendering)
    }

    return {
        isPrintButtonLoading,
        print
    }
}