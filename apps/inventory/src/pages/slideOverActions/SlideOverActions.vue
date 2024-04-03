<script setup>
import { ref, nextTick, inject, shallowRef } from 'vue'
import { Slideover } from 'layout'
import { useI18n } from 'vue-i18n'
import { showUuid } from 'shared'
import ModifyQuantity from './ModifyQuantity.vue'
import Grouping from './Grouping.vue'
import Convert from './Convert.vue'
import Move from './Move.vue'
import Cull from './Cull.vue'
import ChangeStage from './ChangeStage.vue'
import ToLot from './ToLot.vue'
import Reweight from './Reweight.vue'
import Lock from './Lock.vue'
import Print from './Print.vue'
import TakeLabSample from './TakeLabSample.vue'

const props = defineProps({
    type: {
        default: () => null,
        type: String
    }
})

const { t } = useI18n()

const useGlobalStore = inject('useGlobalStore')
const inventoryStore = useGlobalStore('inventory')
const rapidStore = useGlobalStore('rapidStore')

const slideAction = rapidStore.reactiveProperty(`slide-${props.type}`)
const selectedRows = rapidStore.reactiveProperty(`selected-${props.type}-rows`)

const refForm = ref()
const actionView = ref({})

const configSlideOver = ref({
    open: false,
    close: false,
    disableButton: false,
    buttonLabel: null
})

rapidStore.$setCallback(`open-slide-action-${props.type}`, () => {
    nextTick(() => {
        actionView.value = buildActionView(slideAction.value, t)

        configSlideOver.value.open = !configSlideOver.value.open

        configSlideOver.value.disableButton = false

        configSlideOver.value.buttonLabel = actionView.value?.buttonLabel
    })
})

const buildActionView = (slideView) => {
    const id = selectedRows.value.length > 1 ? '-' : selectedRows.value[0] ? showUuid(selectedRows.value[0].id) : ''

    const configActionView = {
        Increase: {
            component: shallowRef(ModifyQuantity),
            title: t('Increase'),
            id
        },
        Decrease: {
            component: shallowRef(ModifyQuantity),
            title: t('Decrease'),
            id
        },
        Move: {
            component: shallowRef(Move),
            title: t('Move'),
            id
        },
        Convert: {
            component: shallowRef(Convert),
            title: t('Convert'),
            id
        },
        Grouping: {
            component: shallowRef(Grouping),
            title: t('Rejoin')
        },
        Cull: {
            component: shallowRef(Cull),
            title: t('Cull'),
            id
        },
        ChangeStage: {
            component: shallowRef(ChangeStage),
            title: t('Change Stage'),
            id
        },
        ToLot: {
            component: shallowRef(ToLot),
            title: t('Make lot'),
            id
        },
        Reweight: {
            component: shallowRef(Reweight),
            title: t('Re-weight'),
            id
        },
        Lock: {
            component: shallowRef(Lock),
            title: t('Lock'),
            id
        },
        PossibleContamination: {
            component: shallowRef(Lock),
            title: t('Possible contamination'),
            id
        },
        Unlock: {
            component: shallowRef(Lock),
            title: t('Unlock'),
            id
        },
        Recall: {
            component: shallowRef(Lock),
            title: t('Recall'),
            id
        },
        ConfirmContamination: {
            component: shallowRef(Lock),
            title: t('Confirm contamination'),
            id
        },
        RemoveQuarantine: {
            component: shallowRef(Lock),
            title: t('Remove from quarantine'),
            id
        },
        Dispose: {
            component: shallowRef(Lock),
            title: t('Dispose'),
            id
        },
        Print: {
            component: shallowRef(Print),
            title: t('Print'),
            id,
            buttonLabel: t('Download')
        },
        TakeLabSample: {
            component: shallowRef(TakeLabSample),
            title: t('Take lab sample'),
            id
        },
        RetakeLabSample: {
            component: shallowRef(TakeLabSample),
            title: t('Retake lab sample'),
            id
        }
    }

    const response = Object.assign({}, configActionView[slideView.action] || configActionView.default)

    return response
}

const renderComponent = () => {
    return actionView.value.component
}

/**
 * Runs when the slideover save button is clicked
 */
const onSave = async ({ setButtonToLoading }) => {
    setButtonToLoading(true)

    const response = await refForm.value.save()

    if (response.success) {
        inventoryStore.fetch()

        configSlideOver.value.close = !configSlideOver.value.close

        // Sync invoice selected items
        rapidStore.$emitGlobalEvent('selectedItems:invoice')

        // Sync sub item list
        response.success && props.type === 'inventory subitem' && rapidStore.$emitGlobalEvent('load-subitem-list')
    }

    setButtonToLoading(false)
}

const onDisabledButton = (value) => (configSlideOver.value.disableButton = value)
</script>

<template>
    <Slideover
        :open="configSlideOver.open"
        :title="actionView.title"
        :id="actionView?.id"
        has-cancel-button
        has-save-button
        :disableSaveButton="configSlideOver.disableButton"
        :firstPanelSaveButtonTitle="configSlideOver.buttonLabel"
        @clickOnSave="onSave"
        :close="configSlideOver.close">
        <component
            :key="type"
            ref="refForm"
            @disabledButton="onDisabledButton"
            :type="type"
            :is="renderComponent()" />
    </Slideover>
</template>
