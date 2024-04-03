<script setup>
import { ref, computed, onMounted } from 'vue'
import { Slideover } from 'layout'
import { useI18n } from 'vue-i18n'
import { showUuid } from 'shared'
import Save from './Save.vue'
import Combine from './Combine.vue'

const { t } = useI18n()

const props = defineProps({
    useSlideOver: Object,
    apiGrid: Object
})

const formComponent = ref()

const views = {
    Save: {
        component: Save,
        title: t('Supplies'),
        saveButtonTitle: t('Save'),
        colorButton: 'primary'
    },
    Combine: {
        component: Combine,
        title: t('Combine supplies'),
        saveButtonTitle: t('Combine'),
        colorButton: 'primary'
    }
}

const { configSlideOver, action, data, component, onSave, onAfterSave } = props.useSlideOver

const renderComponent = () => {
    return views[action.value].component ? views[action.value].component : null
}

const actionView = computed(() => {
    return {
        id: data.value.id ? showUuid(data.value.id) : '',
        title: data.value?.title || views[action.value]?.title,
        saveButtonTitle: views[action.value]?.saveButtonTitle,
        colorButton: views[action.value]?.colorButton,
        disableSaveButton: configSlideOver.value.disableSaveButton
    }
})

const onSaveForm = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    if (onSave.value[action.value]) {
        const result = await onSave.value[action.value]()

        setButtonToLoading(false)

        return
    }

    const response = await formComponent.value.save({ setButtonToLoading })

    setButtonToLoading(false)

    if (response.success) {
        configSlideOver.value.close = !configSlideOver.value.close

        props.apiGrid?.deselectAll()
    }

    if (onAfterSave.value[action.value]) {
        onAfterSave.value[action.value](response)
    }
}

const onClose = () => {
    configSlideOver.value.disableSaveButton = false
}

onMounted(() => {
    component.value.form = formComponent
})
</script>

<template>
    <Slideover
        :open="configSlideOver.open"
        :title="actionView.title"
        :id="actionView.id"
        has-cancel-button
        :disableSaveButton="configSlideOver.disableSaveButton"
        @clickOnSave="onSaveForm"
        @closed="onClose"
        :firstPanelSaveButtonTitle="actionView.saveButtonTitle"
        :firstPanelColorButton="actionView.colorButton"
        has-save-button
        :close="configSlideOver.close" >
        <component
            :useSlideOver="useSlideOver"
            ref="formComponent"
            :is="renderComponent()" />
    </Slideover>
</template>
