import { ref } from 'vue'

export const useAlertModal = () => {
    const showAlert = ref(false)

    const modelData = ref('')

    const configModal = ref({
        template: null,
        title: null,
        description: null,
        confirmButtonLabel: null,
        confirm: null,
        confirmation: null
    })

    return {
        configModal,
        showAlert,
        modelData
    }
}
