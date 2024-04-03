<script setup>
import { inject, ref, markRaw, onMounted, watch, onUnmounted } from 'vue'
import { Stepper, Alert, Overlay, ActionButtons } from 'layout'
import { SelectCustomDate } from 'form'
import StepWithoutContainer from '../../components/StepWithoutContainer.vue'
import { useStep } from '../../components/useStep'
import Summary from '../../components/Summary.vue'
import { useI18n } from 'vue-i18n'
import StepTitle from '../../components/StepTitle.vue'
import { configRightButtons } from '../../components/configButtons'

const { t } = useI18n()

const api = inject('api')

const router = inject('router')

const useGlobalStore = inject('useGlobalStore')
const inventoryStore = useGlobalStore('inventory')
const rapidStore = useGlobalStore('rapidStore')
const parameterStore = useGlobalStore('parameters')
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
    type: null,
    message: ''
})

const unwatch = watch(() => step.value, (nValue, oValue) => {
    calculateRemaning('items_remaining')
})

// Data and validations for all steps on machine trim process
const steps = ref([
    {
        id: 'items_result',
        name: t('Plant'),
        subtitle: t('Plant information'),
        status: 'current',
        prefix: 'plant',
        complete: true,
        optional: false,
        selectedOption: true,
        enableAdd: true,
        items: [],
        quantityField: 'quantity',
        locationSlug: 'flowering-room',
        component: markRaw(StepWithoutContainer),
        errors: [],
        next: async (goNext) => {
            const response = await validateStep('items_result', 'stock/cultivation_validation')

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
    quantitySummaryObject,
    summaryObject,
    disableNextButton,
    disablePreviousButton,
    measure,
    navigationIsEnable,
    dataToValidate,
    getGeneralMessage,
    formatStepData,
    validateStep,
    calculateRemaning
} = useStep(configUseStep)

// Format all data and send to api to save
const save = async () => {
    loadings.value.saveButton = true

    const lastStep = steps.value[steps.value.length - 1]

    const responseLastStep = await validateStep(lastStep.id, 'stock/cultivation_validation')

    if (!responseLastStep) {
        loadings.value.saveButton = false

        return
    }

    const apiData = formatStepData(generalData)

    const url = router.currentRoute.value.query.child ? '/stock/change_to_flower_child' : '/stock/change_to_flower'

    const response = await api.post(url, apiData)

    if (response.success && !response.errors) {
        inventoryStore.fetch()

        rapidStore.$emitGlobalEvent('load-subitem-list')

        tabsStore.closeTab('BeginFlower')
    }

    if (!response.success && !response.errors) {
        generalMessage.value = {
            isOpen: true,
            type: 'danger',
            message: response.message
        }
    }

    loadings.value.saveButton = false
}

const rightButtons = configRightButtons({ actions: { save }, dataToValidate, rule: 'genericCultivation' })

onUnmounted(() => { unwatch() })

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

    <!-- Content Main -->
    <section class="!pt-0">
        <Stepper
            v-model="step"
            v-model:steps="steps"
            :disablePreviousButton="disablePreviousButton"
            :disableNextButton="disableNextButton"
            :hasForwardButton="!dataToValidate.last"
            :has-navigation-buttons="true"
            :disable-direct-navitagion="!navigationIsEnable">
            <template v-slot:extra-right-button>
                <ActionButtons
                    v-if="dataToValidate?.last"
                    :items="rightButtons" />
            </template>

            <!-- Steps for machine trim -->
            <template
                v-for="(stepObject, index) of steps"
                :key="index"
                v-slot:[`content-step-${index+1}`]>
                <div class="grid grid-cols-12 h-full w-full bg-gray-50 gap-5">
                    <!-- Left side -->
                    <div class="col-span-9 pl-4 pr-0 space-y-5">
                        <!-- Title for step -->
                        <StepTitle
                            :step="stepObject"
                            :ids="ids" />

                        <!-- General messages -->
                        <Alert
                            v-if="getGeneralMessage.message"
                            v-model="getGeneralMessage.isOpen"
                            :type="getGeneralMessage.type"
                            :hasCloseButton="false"
                            :content="getGeneralMessage.message" />

                        <!-- Step component -->
                        <component
                            :is="stepObject.component"
                            v-model:currentStep="steps[index]"
                            v-model:steps="steps"
                            v-model:step="step"
                            :measure="measure" />
                    </div>

                    <!-- Rigth side -->
                    <div class="col-span-3 space-y-5">
                        <!-- Summary for data -->
                        <Summary
                            :title="$t('Quantity summary')"
                            :subtitle="`${$t('Available quantity:')} ${totalProduct} ${measure}`"
                            :elements="quantitySummaryObject" />

                        <!-- Summary for data-->
                        <Summary
                            :title="$t('Summary')"
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
