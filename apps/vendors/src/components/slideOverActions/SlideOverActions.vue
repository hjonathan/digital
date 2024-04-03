<script setup>
import { ref, computed, onMounted } from 'vue'
import { Slideover } from 'layout'
import { useI18n } from 'vue-i18n'
import Create from './Create.vue'

const { t } = useI18n()

const props = defineProps({
    useSlideOver: Object
})

const formComponent = ref()

const views = {
    Create: {
        component: Create,
        title: t('Create vendor'),
        saveButtonTitle: t('Save')
    },
    Edit: {
        component: Create,
        title: t('Edit vendor'),
        saveButtonTitle: t('Save')
    },
    Clone: {
        component: Create,
        title: t('Clone vendor'),
        saveButtonTitle: t('Save')
    }
}

const { configSlideOver, component, data } = props.useSlideOver

const renderComponent = () => {
    return views[configSlideOver.value.action].component ? views[configSlideOver.value.action].component : null
}

const actionView = computed(() => {
    return {
        id: configSlideOver.value.id,
        title: views[configSlideOver.value.action]?.title,
        saveButtonTitle: views[configSlideOver.value.action]?.saveButtonTitle,
        colorButton: views[configSlideOver.value.action]?.colorButton,
        disableSaveButton: configSlideOver.value.disableSaveButton
    }
})

const onSaveForm = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    if (configSlideOver.value.onSave[configSlideOver.value.action]) {
        const result = await configSlideOver.value.onSave[configSlideOver.value.action]()

        setButtonToLoading(false)

        return
    }

    const response = await formComponent.value.save({ setButtonToLoading })

    setButtonToLoading(false)

    if (response.success) {
        configSlideOver.value.close = !configSlideOver.value.close

        data.value = []

        if (configSlideOver.value.onAfterSave[configSlideOver.value.action]) {
            configSlideOver.value.onAfterSave[configSlideOver.value.action]()
        }
    }
}

const onCancelForm = () => {
    data.value = []
}

const onClose = () => {
    configSlideOver.value.disableSaveButton = false

    data.value = []
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
        @clickOnCancel="onCancelForm"
        @closed="onClose"
        :firstPanelSaveButtonTitle="actionView.saveButtonTitle"
        :firstPanelColorButton="actionView.colorButton"
        has-save-button
        :close="configSlideOver.close">
        <component
            :useSlideOver="useSlideOver"
            ref="formComponent"
            :is="renderComponent()" />
    </Slideover>
</template>
