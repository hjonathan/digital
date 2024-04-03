import { ref } from 'vue'

export const useSlideOver = () => {
    const action = ref()

    const data = ref({})

    // eslint-disable-next-line prefer-const
    const component = ref({
        form: ref()
    })

    const transferId = ref()

    const configSlideOver = ref({
        open: false,
        close: false,
        disableSaveButton: false,
        colorButton: 'primary'
    })

    const onSave = ref({})

    const onAfterSave = ref({})

    const setOnSave = (key, value) => {
        onSave.value[key] = value
    }

    const setOnAfterSave = (key, value) => {
        onAfterSave.value[key] = value
    }

    return {
        component,
        onSave,
        onAfterSave,
        setOnSave,
        setOnAfterSave,
        data,
        transferId,
        action,
        configSlideOver
    }
}
