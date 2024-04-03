<script setup>
import { Stepper, ActionButtons } from 'layout'
import { ref, computed, inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Destination from './Destination.vue'
import Items from './Items.vue'
import { useTransfer as useComposable } from './useTransfer'
import { jsonLogic } from 'jsonRules'
import { buttonRuleTransfers } from '../main/configRules'
import { mdiContentSave, mdiPlus } from '@mdi/js'
import { useSlideOver as useComposableSlideOver } from '../../components/slideOverActions/useSlideOver'
import SlideOverActions from '../../components/slideOverActions/SlideOverActions.vue'

const { t } = useI18n()
const useGlobalStore = inject('useGlobalStore')
const tabsStore = useGlobalStore('tabs')
const rapidStore = useGlobalStore('rapidStore')
const router = inject('router')

const useStepper = ref()

const idThread = router.currentRoute.value?.query?.idThread
const action = router.currentRoute.value?.query?.action

const props = defineProps({
    transfer: {
        type: Object,
        default: null
    },
    mode: {
        type: String,
        default: 'create'
    },
    itemsMode: {
        type: String,
        default: 'readonly'
    }
})

const steps = ref([
    {
        id: 'destination',
        name: t('Destination'),
        status: 'current',
        errorMessage: t('Destination not found'),
        validation () {
            return facility.value.rawData
        },
        next (goNext) {
            goNext()
        }
    },
    {
        id: 'items',
        name: t('Items'),
        status: 'upcoming',
        validation () {
            return items.value.rawData?.length
        },
        next (goNext) {
            goNext()
        }
    },
])

const step = ref()

const useTransfer = useComposable({ step, steps, transfer: props.transfer, mode: props.mode, useStepper, parentThread: { idThread, action } })
const useSlideOver = useComposableSlideOver({})

const {
    thread,
    visibleNext,
    enablePrevius,
    items,
    transferId,
    loadings,
    facility,
    save,
    addFacility,
    formatApiData,
    formatApiDataAssignment
} = useTransfer

const getButtonSave = () => {
    let saveButton = {
        icon: mdiContentSave,
        classType: 'teal',
        label: props.mode === 'edit' ? t('Save changes') : t('Add to dispatch'),
        spinner: loadings.value.saveButton,
        pulse: jsonLogic.apply(buttonRuleTransfers.save, {
            ...formatApiData(),
            itemsLength: items.value.rawData?.length,
            saveButton: loadings.value.saveButton
        }),
        disabled: !jsonLogic.apply(buttonRuleTransfers.save, {
            ...formatApiData(),
            itemsLength: items.value.rawData?.length,
            saveButton: loadings.value.saveButton
        }),
        action: async () => {
            await save()
        }
    }

    if (props.itemsMode === 'assignment') {
        saveButton = {
            icon: mdiContentSave,
            classType: 'teal',
            label: t('Send transfer'),
            spinner: loadings.value.saveButton,
            pulse: jsonLogic.apply(buttonRuleTransfers.save, {
                ...formatApiData(),
                itemsLength: items.value.rawData?.length,
                saveButton: loadings.value.saveButton
            }),
            disabled: !jsonLogic.apply(buttonRuleTransfers.save, {
                ...formatApiData(),
                itemsLength: items.value.rawData?.length,
                saveButton: loadings.value.saveButton
            }),
            action: async () => {
                // await sendAssignment()
                const { configSlideOver, action, data } = useSlideOver

                action.value = 'SendAssignment'

                data.value = formatApiDataAssignment()

                configSlideOver.value.open = !configSlideOver.value.open
            }
        }
    }

    return saveButton
}

const buttons = computed(() => {
    return [
        {
            icon: mdiPlus,
            classType: 'teal',
            label: t('Add items'),
            show: step.value === 'items',
            pulse: items.value.rawData?.length === 0,
            action () {
                tabsStore.openTab({ name: 'transfersInventory', query: thread.value, alias: t('Transfer items') })
            }
        },
        getButtonSave(),
    ]
})

const itemsSelected = rapidStore.reactiveProperty(`${thread.value.idThread}-selected-items`, [], true)

onMounted(() => {
    if (props.transfer) {
        transferId.value = props.transfer.id

        items.value.rawData = props.transfer.item

        itemsSelected.value = props.transfer.item

        addFacility(props.transfer.destination_facility, false)

        useStepper.value.validateAllSteps()

        useStepper.value.goToIncompleteStep()
    }

    const stepTransfer = router.currentRoute.value?.query?.stepTransfer

    if (stepTransfer) step.value = stepTransfer
})

const onReady = (useComposable) => (useStepper.value = useComposable)

</script>

<template>
    <div class="mx-auto">
        <Stepper
            navClass="max-w-8xl mx-auto w-full"
            headerClass="flex sticky top-0 z-10 bg-slate-100"
            v-model="step"
            v-model:steps="steps"
            :onReady="onReady"
            :disablePreviousButton="!enablePrevius"
            :disableNextButton="!visibleNext"
            :activateValidation="true"
            :disableDirectNavitagion="false">
            <template v-slot:extra-left-button>
                <ActionButtons :items="buttons" />
            </template>

            <template v-slot:content-step-1>
                <Destination
                    v-model:step="steps[0]"
                    :useTransfer="useTransfer">
                </Destination>
            </template>

            <template v-slot:content-step-2>
                <Items
                    v-model:step="steps[1]"
                    :useTransfer="useTransfer"
                    :itemsMode="itemsMode" />
            </template>
        </Stepper>

        <SlideOverActions :useSlideOver="useSlideOver"/>
    </div>
</template>
