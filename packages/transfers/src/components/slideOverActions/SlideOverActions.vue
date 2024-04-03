<script setup>
import { ref, computed, onMounted } from 'vue'
import { Slideover } from 'layout'
import { useI18n } from 'vue-i18n'
import { showUuid } from 'shared'
import Reject from './Reject.vue'
import Cancel from './Cancel.vue'

import Receive from './Receive.vue'
import AcceptItemFound from './AcceptItemFound.vue'

import RejectAdjustment from './RejectAdjustment.vue'
import SendAssignment from './SendAssignment.vue'

const { t } = useI18n()

const props = defineProps({
    useSlideOver: Object
})

const formComponent = ref()

const views = {
    Cancel: {
        component: Cancel,
        title: t('Cancel transfer'),
        saveButtonTitle: t('Save'),
        colorButton: 'danger'
    },
    Reject: {
        component: Reject,
        title: t('Reject'),
        saveButtonTitle: t('Reject'),
        colorButton: 'danger'
    },
    Receive: {
        component: Receive,
        title: t('Receive'),
        saveButtonTitle: t('Receive')
    },
    AcceptItemFound: {
        component: AcceptItemFound,
        title: t('Receive item found'),
        saveButtonTitle: t('Receive')
    },
    RejectAdjustment: {
        component: RejectAdjustment,
        title: t('Reject adjustment'),
        saveButtonTitle: t('Reject'),
        colorButton: 'danger'
    },
    SendAssignment: {
        component: SendAssignment,
        title: t('Send lost & found'),
        saveButtonTitle: t('Send')
    }
}

const { configSlideOver, action, transferId, component, onSave, onAfterSave } = props.useSlideOver

const renderComponent = () => {
    return views[action.value].component ? views[action.value].component : null
}

const actionView = computed(() => {
    return {
        id: transferId.value ? showUuid(transferId.value) : '',
        transferId: transferId.value,
        title: views[action.value]?.title,
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
    }

    if (onAfterSave.value[action.value]) {
        onAfterSave.value[action.value]()
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
        :close="configSlideOver.close">
        <component
            :useSlideOver="useSlideOver"
            ref="formComponent"
            :transferId="actionView.transferId"
            :is="renderComponent()" />
    </Slideover>
</template>
