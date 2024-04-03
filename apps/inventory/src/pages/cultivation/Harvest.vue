<script setup>
import { inject, ref, markRaw, onMounted, watch, onUnmounted, computed } from 'vue'
import { Stepper, Alert, Overlay, ActionButtons } from 'layout'
import { SelectCustomDate } from 'form'
import StepWithContainer from '../../components/StepWithContainer.vue'
import { useStep } from '../../components/useStep'
import Summary from '../../components/Summary.vue'
import { useI18n } from 'vue-i18n'
import WasteStep from '../../components/WasteStep.vue'
import StepWithoutContainer from '../../components/StepWithoutContainer.vue'
import { configRightButtons } from '../../components/configButtons'
import { round } from 'shared'
import StepTitle from '../../components/StepTitle.vue'
import { sumTotal } from '../../components/operations'

const { t } = useI18n()

const api = inject('api')

const router = inject('router')

const useGlobalStore = inject('useGlobalStore')
const inventoryStore = useGlobalStore('inventory')
const parameterStore = useGlobalStore('parameters')
const rapidStore = useGlobalStore('rapidStore')
const tabsStore = useGlobalStore('tabs')

const validateEvaporation = ref(false)
const loadings = ref({
    general: false,
    saveButton: false
})

const ids = ref([])

// Data sended from inventory that contains selected products
const selectedRows = ref([])
const step = ref()

const generalData = ref({})

const generalMessage = ref({
    isOpen: false,
    message: ''
})

// Calculate if remaining step is optional or required
const calculateWaste = (stepIdWaste) => {
    const currentStepPosition = steps.value.findIndex(step => step.id === stepIdWaste)

    if (currentStepPosition > -1) {
        if (!totalWaste.value) {
            steps.value[currentStepPosition].items = []
        }

        steps.value[currentStepPosition].enableAdd = dataToValidate.value.totalWasteRemaining < totalProduct.value

        steps.value[currentStepPosition].selectedOption = dataToValidate.value.totalWasteRemaining === totalProduct.value ||
            steps.value[currentStepPosition].complete
    }
}

// Calculate if remaining step is optional or required
const calculateRemaning = (stepIdRemaining) => {
    const currentStepPosition = steps.value.findIndex(step => step.id === stepIdRemaining)

    if (currentStepPosition > -1) {
        if (!dataToValidate.value.totalRemaining) {
            steps.value[currentStepPosition].complete = false

            steps.value[currentStepPosition].items = []
        }

        steps.value[currentStepPosition].enableAdd = dataToValidate.value.totalWasteRemaining < totalProduct.value

        steps.value[currentStepPosition].optional = dataToValidate.value.totalWasteRemaining === totalProduct.value

        steps.value[currentStepPosition].selectedOption = dataToValidate.value.totalWasteRemaining === totalProduct.value
    }
}

const unwatch = watch(() => step.value, (nValue, oValue) => {
    calculateWaste('waste')

    calculateRemaning('items_remaining')
})

// Data and validations for all steps on machine trim process
const steps = ref([
    {
        id: 'items_result',
        name: t('Harvest Weight'),
        subtitle: t('Introduce harvest weight'),
        status: 'current',
        prefix: 'harvest',
        complete: true,
        optional: false,
        selectedOption: true,
        enableAdd: true,
        items: [],
        quantityField: 'quantity',
        locationSlug: 'harvest-room',
        measure: t('grams'),
        component: markRaw(StepWithContainer),
        errors: [],
        next: async (goNext) => {
            const response = await validateStep('items_result', 'stock/harvest_validation')

            response && goNext()
        }
    },
    {
        id: 'waste',
        name: t('Waste'),
        subtitle: t('Introduce waste'),
        status: 'upcoming',
        prefix: 'waste',
        complete: false,
        optional: true,
        selectedOption: false,
        enableAdd: true,
        items: [],
        quantityField: 'waste',
        measure: t('grams'),
        component: markRaw(WasteStep),
        errors: [],
        next: async (goNext) => {
            const response = await validateStep('waste', 'stock/harvest_validation')

            response && goNext()
        }
    },
    {
        id: 'items_remaining',
        name: t('Remaining'),
        subtitle: t('Set remaining quantity'),
        status: 'upcoming',
        prefix: 'remaining',
        complete: false,
        optional: true,
        selectedOption: false,
        enableAdd: true,
        items: [],
        quantityField: 'quantity',
        measure: t('units'),
        component: markRaw(StepWithoutContainer),
        errors: []
    },
])

// Create config for useStep
const configUseStep = {
    selectedRows,
    steps,
    step,
    validateEvaporation,
    generalMessage,
    loadings,
    generalData,
    t
}

// Create a common computed elements
const {
    totalProduct,
    measure,
    totalWaste,
    formatStepData,
    validateStep,
    dataToValidate
} = useStep(configUseStep)

const summaryObject = computed(() => {
    const items = []

    for (const step of steps.value) {
        items.push({
            title: step.name,
            quantity: round(sumTotal(step.items, step.quantityField))
        })
    }

    items.push({
        title: t('Total (in containers)'),
        quantity: round(dataToValidate.value.totalInContainers),
        isBold: true,
        containerClass: 'border-t-2 border-t-gray-400'
    })

    items.push({
        title: t('Total available'),
        quantity: round(totalProduct.value - dataToValidate.value.totalWasteRemaining),
        isBold: true,
        containerClass: round(totalProduct.value - dataToValidate.value.totalWasteRemaining) >= 0
            ? ''
            : 'text-error-500'
    })

    return items
})

// Format all data and send to api to save
const save = async () => {
    loadings.value.saveButton = true

    const lastStep = steps.value[steps.value.length - 1]

    const responseLastStep = await validateStep(lastStep.id, 'stock/harvest_validation')

    if (!responseLastStep) {
        loadings.value.saveButton = false

        return
    }

    const apiData = formatStepData()

    const url = router.currentRoute.value.query.child ? '/stock/harvest_child' : '/stock/harvest'

    const response = await api.post(url, apiData)

    if (response.success && !response.errors) {
        inventoryStore.fetch()

        rapidStore.$emitGlobalEvent('load-subitem-list')

        tabsStore.closeTab('Harvest')
    }

    if (!response.success && !response.errors) {
        generalMessage.value = {
            isOpen: true,
            type: 'danger',
            message: response.message
        }
    }

    !response.errors && response.success && tabsStore.closeTab('Harvest')

    inventoryStore.fetch()

    loadings.value.saveButton = false
}

const getGeneralMessage = computed(() => {
    if (dataToValidate.value.totalWaste > dataToValidate.value.totalProduct) {
        return {
            isOpen: true,
            type: 'danger',
            message: t('The waste must not exceed the available quantity')
        }
    }

    if (dataToValidate.value.totalRemaining > dataToValidate.value.totalProduct) {
        return {
            isOpen: true,
            type: 'danger',
            message: t('The remaining must not exceed the available quantity')
        }
    }

    if (dataToValidate.value.totalWaste + dataToValidate.value.totalRemaining > dataToValidate.value.totalProduct) {
        return {
            isOpen: true,
            type: 'danger',
            message: t('The remaining and waste must not exceed the available quantity')
        }
    }

    return generalMessage
})

onUnmounted(() => { unwatch() })

const rightButtons = configRightButtons({ actions: { save }, dataToValidate, rule: 'saveHarvest' })

onMounted(async () => {
    loadings.value.general = true

    ids.value = router.currentRoute.value.query.id

    !Array.isArray(ids.value) && (ids.value = [ids.value])

    const response = await inventoryStore.getInventoryItems(ids.value)

    if (response.success) {
        const remainingPosition = steps.value.findIndex(localStep => localStep.id === 'items_remaining')

        const initialLocation = await parameterStore.getElementById(response.data[0]?.location?.parent_id)

        remainingPosition > -1 && (steps.value[remainingPosition].locationSlug = initialLocation.slug)

        selectedRows.value = response.data
    }

    loadings.value.general = false
})
</script>

<template>
    <Overlay
        v-if="loadings.general"
        :title="$t('Loading...')"/>
    <!-- <pre>{{ dataToValidate }}</pre> -->
    <section class="!pt-0">
        <!-- Steps for machine trim -->
        <Stepper
            v-model="step"
            v-model:steps="steps"
            :disablePreviousButton="dataToValidate?.first || dataToValidate.totalWasteRemaining > totalProduct"
            :disableNextButton="!dataToValidate?.selectedOption || dataToValidate.totalWasteRemaining > totalProduct"
            :hasForwardButton="!dataToValidate?.last"
            :disableDirectNavitagion="dataToValidate.totalWasteRemaining > totalProduct">
            <template v-slot:extra-right-button>
                <ActionButtons
                    v-if="dataToValidate?.last"
                    :items="rightButtons" />
            </template>

            <template
                v-for="(stepObject, index) of steps"
                :key="index"
                v-slot:[`content-step-${index+1}`]>
                <div class="grid grid-cols-12 h-full bg-gray-50 gap-5 pl-5">
                    <!-- Left side -->
                    <div class="col-span-9 space-y-5 py-5">
                        <!-- Title for step -->
                        <StepTitle
                            :step="stepObject"
                            :ids="ids" />

                        <Alert
                            v-if="getGeneralMessage.message"
                            v-model="getGeneralMessage.isOpen"
                            :type="getGeneralMessage.type"
                            :hasCloseButton="false"
                            :content="getGeneralMessage.message" />

                        <component
                            :is="stepObject.component"
                            v-model:currentStep="steps[index]"
                            v-model:steps="steps"
                            v-model:step="step"
                            :measure="stepObject.measure" />
                    </div>

                    <div class="col-span-3">
                        <Summary
                            :title="$t('Summary')"
                            :subtitle="`${$t('Available quantity:')} ${totalProduct} ${measure}`"
                            :elements="summaryObject">
                            <template v-slot:bottom-section>
                                <SelectCustomDate
                                    v-model="generalData.updated_at"
                                    label-size="text-base"
                                    action-button-size="text-sm"
                                    class="!mb-0" />
                            </template>
                        </Summary>
                    </div>
                </div>
            </template>
        </Stepper>
    </section>
</template>
