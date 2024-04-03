import { ref } from 'vue'

export const useSlideOver = () => {
    const data = ref()

    const component = ref({
        form: ref()
    })

    const configSlideOver = ref({
        action: null,
        id: null,
        open: false,
        close: false,
        disableSaveButton: false,
        colorButton: 'primary',
        onSave: {},
        onAfterSave: {}
    })

    const setOnSave = (key, value) => {
        configSlideOver.value.onSave[key] = value
    }

    const setOnAfterSave = (key, value) => {
        configSlideOver.value.onAfterSave[key] = value
    }

    const setConfig = (object) => {
        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                configSlideOver.value[key] = object[key]
            }
        }
    }

    return {
        component,
        setOnSave,
        setOnAfterSave,
        data,
        setConfig,
        configSlideOver
    }
}
