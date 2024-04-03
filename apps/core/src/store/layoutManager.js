import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('layoutManager', () => {
    const globalOverlay = ref({
        show: false
    })

    const confirmationModal = ref({
        show: false
    })

    const globalAlert = ref({
        closeButton: false,
        content: '',
        type: 'danger',
        show: false,
        time: null
    })

    const versionUpdater = ref({
        position: 'top', // top, bottom
        card: false,
        button: false
    })

    const setVersionUpdater = (value) => {
        versionUpdater.value = {
            ...versionUpdater.value,
            ...value
        }
    }

    const setAlert = (value) => {
        if (value.time) {
            setTimeout(() => {
                globalAlert.value.show = false
            }, value.time)
        }

        globalAlert.value = {
            ...globalAlert.value,
            ...value
        }
    }

    const showOverlay = (time) => {
        globalOverlay.value.show = true

        setTimeout(() => {
            globalOverlay.value.show = false
        }, time || 500)
    }

    const showModalLogout = () => {
        confirmationModal.value.show = true
    }

    const hideModalLogout = () => {
        confirmationModal.value.show = false
    }

    return {
        versionUpdater,
        globalOverlay,
        setVersionUpdater,
        showOverlay,
        setAlert,
        globalAlert,
        confirmationModal,
        showModalLogout,
        hideModalLogout
    }
})
