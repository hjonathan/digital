<script setup>
import { ref, useSlots, computed, watch, onMounted, onUnmounted } from 'vue'
import Step from './Step.vue'
import { isFunction } from 'lodash'
import { defineModel } from 'shared'
import { ActionButtons } from 'layout'
import { mdiArrowLeftBold, mdiArrowRightBold } from '@mdi/js'
import { useComposable } from './useStepper'

const props = defineProps({
    // Changes current step position
    modelValue: [Number, String],
    steps: {
        type: Array,
        default: () => ([
            {
                id: '',
                name: '',
                status: '',
                component: () => ({})
            },
        ])
    },
    onReady: {
        type: Function,
        default: () => {}
    },

    // Shows or hides the navigation buttons (next and previous).
    hasNavigationButtons: {
        type: Boolean,
        default: true
    },

    // Shows or hides forward button.
    hasForwardButton: {
        type: Boolean,
        default: true
    },

    // Shows or hides previous button.
    hasPreviousButton: {
        type: Boolean,
        default: true
    },
    // Disables direct navigation (Clicking directly on the step)
    disableDirectNavitagion: {
        type: Boolean,
        default: false
    },
    activateValidation: {
        type: Boolean,
        default: false
    },
    previousButtonLabel: {
        type: String,
        default: 'Prev'
    },
    previousButtonIcon: {
        type: String,
        default: mdiArrowLeftBold
    },
    disablePreviousButton: {
        type: Boolean,
        default: false
    },
    nextButtonLabel: {
        type: String,
        default: 'Next'
    },
    nextButtonIcon: {
        type: String,
        default: mdiArrowRightBold
    },
    disableNextButton: {
        type: Boolean,
        default: false
    },

    // Must match the background color of the parent container where the stepper is used.
    backgroundColor: {
        type: String,
        default: 'bg-gray-100'
    },
    navClass: {
        type: String,
        default: ''
    },
    headerClass: {
        type: String,
        default: ''
    },

    headerPadding: {
        type: Boolean,
        default: false
    }
})

const buttonStatus = ref({
    disabledPreviousButton: false,
    loadingPreviousButton: false,
    disabledForwardButton: false,
    loadingForwardButton: false
})

const currentAnimation = ref('next')

// Steps in reactive state
const allSteps = defineModel('steps')

// Current step id
const currentStepId = defineModel('modelValue')

// Current step
const currentStep = ref({})

// Watch currentStepId and update currentStep
const unwatch = watch(() => currentStepId.value, (newValue) => {
    goToStep(newValue)
})

// Change the current step to the step with stepId, marked as completed and the new current as current
const goToStep = (stepId, status = 'complete') => {
    allSteps.value.forEach((step) => {
        if (currentStep.value.id === step.id) {
            step.isCurrent = false

            props.activateValidation && (step.status = getStepValidation(step) ? 'complete' : 'error')

            !props.activateValidation && (step.status = status)
        }

        if (stepId === step.id) {
            step.isCurrent = true

            step.status = 'current'
        }
    })

    currentStepId.value = stepId

    currentStep.value = allSteps.value.find(step => step.id === stepId)
}

// Gets next step
const getNextStep = (stepId) => {
    const currentPosition = allSteps.value.findIndex(step => step.id === stepId)

    if (currentPosition < 0 || currentPosition >= allSteps.value.length - 1) return null

    const step = allSteps.value[currentPosition + 1]

    if (step.status === 'disabled') return getNextStep(step.id)

    return step
}

// Moves forward one step
const goNext = () => {
    currentAnimation.value = 'next'

    const nextStep = getNextStep(currentStep.value.id)

    nextStep && goToStep(nextStep.id)
}

// Gets the previous step
const getPreviousStep = (stepId) => {
    const currentPosition = allSteps.value.findIndex(step => step.id === stepId)

    if (currentPosition <= 0) return

    const step = allSteps.value[currentPosition - 1]

    if (step.status === 'disabled') return getPreviousStep(step.id)

    return step
}

// Go to previous step
const goPrevious = () => {
    currentAnimation.value = 'previous'

    const previousStep = getPreviousStep(currentStep.value.id)

    previousStep && goToStep(previousStep.id, 'upcoming')
}

// Unsubscribe watch
onUnmounted(() => { unwatch() })

// Initialize the currentStepId and currentStep
onMounted(() => {
    if (!currentStepId.value) {
        currentStepId.value = props.steps[0].id
    }

    if (currentStepId.value || currentStepId.value === 0) {
        const stepIndex = allSteps.value.findIndex(step => step.id === currentStepId.value)

        stepIndex > -1 && (currentStep.value = allSteps.value[stepIndex])
    }
})

const slots = useSlots()

const findSlotByName = (name) => {
    return Object.keys(slots).find(slot => slot === name)
}

// Previous button config
const previousButton = computed(() => {
    const res = [
        {
            icon: props.previousButtonIcon,
            label: props.previousButtonLabel,
            type: 'button',
            spinner: buttonStatus.value.loadingPreviousButton,
            disabled: props.disablePreviousButton || buttonStatus.value.disabledPreviousButton,
            classType: 'primary',
            spinnerColor: 'text-red-500',
            action: async () => {
                buttonStatus.value.disabledPreviousButton = true
                buttonStatus.value.loadingPreviousButton = true

                isFunction(currentStep.value.previous) ? await currentStep.value.previous(goPrevious) : goPrevious()

                buttonStatus.value.disabledPreviousButton = false
                buttonStatus.value.loadingPreviousButton = false
            }
        },
    ]

    return res
})

// Next button config
const forwardButton = computed(() => {
    const res = [
        {
            icon: props.nextButtonIcon,
            label: props.nextButtonLabel,
            type: 'button',
            pulse: true,
            spinner: buttonStatus.value.loadingForwardButton,
            disabled: props.disableNextButton || buttonStatus.value.disabledForwardButton,
            classType: 'primary',
            spinnerColor: 'text-red-500',
            action: async () => {
                buttonStatus.value.disabledForwardButton = true
                buttonStatus.value.loadingForwardButton = true

                isFunction(currentStep.value.next) ? await currentStep.value.next(goNext) : goNext()

                buttonStatus.value.disabledForwardButton = false
                buttonStatus.value.loadingForwardButton = false
            }
        },
    ]

    return res
})

const useStepper = useComposable({
    goPrevious,
    getPreviousStep,
    goNext,
    getNextStep,
    goToStep,
    steps: allSteps,
    step: currentStepId,
    activateValidation: props.activateValidation
})

const { getStepValidation } = useStepper

props.onReady && props.onReady(useStepper)

</script>

<template>
    <div :class="[headerClass]">
        <nav aria-label="Progress" :class="['flex',navClass]">
                <!-- Stepper nav -->
                <div
                    :class="{ 'pl-6' : headerPadding }"
                    class="pr-4 overflow-x-scroll pt-2.5 w-full flex-1">
                    <ol role="list" class="flex items-start">
                        <li
                            v-for="(step, stepIdx) in allSteps"
                            :id="`step-${stepIdx + 1}`"
                            :key="step.name"
                            :class="[stepIdx !== allSteps.length - 1 ? 'pr-8' : '', 'relative']">
                            <!-- Completes step replacement at a specific step -->
                            <slot
                                v-if="findSlotByName(`step-${step.id}`)"
                                :name="`step-${step.id}`" />

                            <Step
                                v-if="!findSlotByName(`step-${step.id}`)"
                                :background-color="backgroundColor"
                                :disableDirectNavitagion="disableDirectNavitagion"
                                :isLast="!(stepIdx < allSteps.length - 1)"
                                :step-idx="stepIdx"
                                :step="step"
                                @navigate="(stepId) => goToStep(stepId)">
                                <!-- Replaces the icon -->
                                <template #icon="{ stepData }">
                                    <slot
                                        v-if="findSlotByName(`step-icon-${step.id}`)"
                                        :stepData="stepData"
                                        :name="`step-icon-${step.id}`" />
                                </template>

                                <!-- Replaces the name -->
                                <template #name="{ stepData }">
                                    <slot
                                        v-if="findSlotByName(`step-name-${step.id}`)"
                                        :stepData="stepData"
                                        :name="`step-name-${step.id}`" />
                                </template>
                            </Step>
                        </li>
                    </ol>
                </div>

                <!-- Previous, Next & Extra content -->
                <div class="pr-5 flex flex-shrink-0">
                    <!-- Extra content/button slot (left) -->
                    <slot
                        v-if="$slots['extra-left-button']"
                        :goNext="goNext"
                        :goPrevious="goPrevious"
                        name="extra-left-button" />

                    <!-- Previous and Next button -->
                    <div v-if="hasNavigationButtons" class="flex">
                        <!-- Replaces previous button in all steps -->
                        <slot
                            :goPrevious="goPrevious"
                            :goNext="goNext"
                            name="previous-button">
                            <ActionButtons
                                v-if="hasPreviousButton"
                                :items="previousButton" />
                        </slot>

                        <!-- Replaces next button in all steps -->
                        <slot
                            :goNext="goNext"
                            :goPrevious="goPrevious"
                            name="next-button">
                        <!-- Default button -->
                            <ActionButtons
                                v-if="hasForwardButton"
                                :items="forwardButton" />
                        </slot>
                    </div>

                    <!-- Extra content/button slot (right) -->
                    <slot
                        v-if="$slots['extra-right-button']"
                        :goNext="goNext"
                        :goPrevious="goPrevious"
                        name="extra-right-button" />
                </div>
        </nav>
    </div>

    <!-- View (variable) section -->
    <div
        v-for="(step, index) in allSteps"
        :key="index"
        :class="['!p-0 !m-0', currentStepId === step.id && step.isCurrent ? 'h-[calc(100%_-_80px)]' : '!h-0 ' ]">
        <transition
            v-if="currentStepId"
            :name="currentAnimation">
            <div v-if="step.isCurrent">
                <slot :name="`content-step-${index + 1}`">
                    <component
                        v-model:currentStep="allSteps[index]"
                        v-model:steps="allSteps"
                        v-model:step="currentStepId"
                        :is="step.component" />
                </slot>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.next-enter-from {
    transition: 0.2s linear;
    transform: translate(100%, 0);
}

.next-enter-active,
.next-leave-active {
    transition: 0.2s linear;
}

.previous-enter-from {
    transition: 0.2s linear;
    transform: translate(-100%, 0);
}

.previous-enter-active,
.previous-leave-active {
    transition: 0.2s linear;
}
</style>
