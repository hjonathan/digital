<script setup>
import { ref, useSlots, computed } from 'vue'
import Step from './Step.vue'
import GroupButtons from './GroupButtons.vue'
import { isFunction } from 'lodash'

import {
    mdiArrowLeftBold,
    mdiArrowRightBold
} from '@mdi/js'

const props = defineProps({
    steps: Object,

    // Allows to show or hide the navigation buttons (next and back).
    hasNavigationButtons: {
        type: Boolean,
        default: true
    },

    // Allows to disable direct navigation (Clicking directly on the step)
    disableDirectNavitagion: {
        type: Boolean,
        default: false
    },
    backButtonLabel: {
        type: String,
        default: 'Back'
    },
    backButtonIcon: {
        type: String,
        default: mdiArrowLeftBold
    },
    nextButtonLabel: {
        type: String,
        default: 'Next'
    },
    nextButtonIcon: {
        type: String,
        default: mdiArrowRightBold
    },

    // This should match the background color of the parent container where the stepper is used.
    backgroundColor: {
        type: String,
        default: 'bg-gray-100'
    }
})

const id = ref(0)
const slots = useSlots()

// Adds an ID to each Step
const allSteps = ref(
    props.steps.map(prop => {
        id.value += 1

        return { ...prop, id: id.value }
    })
)

// Method to advance the stepper to the next step
const goForward = (currentIndex) => {
    // Get the total number of steps in the stepper
    const stepCount = allSteps.value.length

    // Calculate the index of the target step (next step)
    let targetIndex = currentIndex + 1

    // Check if the "Next" action is disabled, and if so, return
    if (isNextOrBackActionDisabled(currentStep.value.disableNext)) { return }

    // Iterate through the steps to find the next enabled step
    while (targetIndex < stepCount) {
        // Get the target step
        const targetStep = allSteps.value[targetIndex]

        // If the target step is disabled, skip to the next one
        if (targetStep.status === 'disabled') {
            targetIndex++

            continue
        }

        // Mark the current step as "complete" and not current
        if (currentStep.value) {
            currentStep.value.status = 'complete'

            currentStep.value.isCurrent = false
        }

        // Update the target step as "current" and update currentStep
        targetStep.status = 'current'

        targetStep.isCurrent = true

        currentStep.value = targetStep

        // Exit the loop after updating the current step
        break
    }
}

// Method to step back the stepper to the previous step.
const goBack = (index) => {
    // Find the step that is currently marked as 'current'
    const previousStep = allSteps.value.find(e => e.isCurrent)

    // Check if the 'Back' action is disabled
    if (isNextOrBackActionDisabled(currentStep.value.disableBack)) { return }

    // Initialize the step decrement value
    const stepDecrement = -1

    // Initialize the target index for the step to go back to
    let targetIndex = index + stepDecrement

    // Find the step corresponding to the target index
    let targetStep = findStepByIndex(targetIndex)

    // Continue moving back while the step is disabled and we haven't reached the first step
    while (targetStep && targetStep.status === 'disabled' && targetIndex > 0) {
        targetIndex += stepDecrement

        targetStep = findStepByIndex(targetIndex)
    }

    // If there is no valid step, do nothing
    if (!targetStep) { return }

    // Update the status of the previous step to 'upcoming' and not 'current'
    if (previousStep) {
        previousStep.status = 'upcoming'

        previousStep.isCurrent = false
    }

    // Update the status of the target step to 'current'
    targetStep.status = 'current'

    targetStep.isCurrent = true

    // Update the currentStep value to the target step
    currentStep.value = targetStep
}

// Method to jump directly to a specific step.
const directNavigation = (currentIndex) => {
    const targetStep = findStepByIndex(currentIndex)

    // Find the step that is currently marked as 'current'
    const previousStep = allSteps.value.find(e => e.isCurrent)

    // If there is no valid is disabled, do nothing
    if (targetStep.status === 'disabled') { return }

    // Changes the state of the previous step to 'complete', and the target step to 'current'.
    if (previousStep) {
        previousStep.status = 'complete'

        previousStep.isCurrent = false
    }

    // Update the status of the target step to 'current'
    targetStep.status = 'current'

    targetStep.isCurrent = true

    // Update the currentStep value to the target step
    currentStep.value = targetStep
}

const findSlotByName = (name) => {
    return Object.keys(slots).find(slot => slot === name)
}

// Method that allows us to disable a specific step
const disableStep = (steps) => {
    allSteps.value.forEach((step, index) => {
        if (steps.includes(index + 1)) {
            step.status = 'disabled'
        }
    })
}

// Method that allows us to enable a specific step
const enableStep = (steps) => {
    allSteps.value.forEach((step, index) => {
        if (steps.includes(index + 1)) {
            step.status = currentStep.value.id === step.id ? 'current' : 'upcoming'
        }
    })
}

// Method that allows us to change any step to 'error' state
const errorStep = (steps) => {
    allSteps.value.forEach((step, index) => {
        if (steps.includes(index + 1)) {
            step.status = 'error'
        }
    })
}

/* Checks if the current step allows forward or backward */
const isNextOrBackActionDisabled = (isDisabled) => {
    if (isFunction(isDisabled) ? isDisabled() : isDisabled) {
        return true
    }

    return false
}

/* Get position of current step */
const getCurrentStepPosition = () => {
    const positionCurrentStep = allSteps.value.findIndex(step => step.id === currentStep.value.id)

    return positionCurrentStep >= 0 ? positionCurrentStep + 1 : null
}

// Search for the current step
const currentStep = ref(allSteps.value.find(step => step.isCurrent))

// Allows finding a specific step based on its index
const findStepByIndex = (index) => {
    return allSteps.value.find(e => e.id === index)
}

// Configuration for the back button
const backButton = computed(() => {
    const res = [
        {
            icon: props.backButtonIcon,
            label: props.backButtonLabel,
            type: 'button',
            pulse: false,
            disabled: isNextOrBackActionDisabled(currentStep.value.disableBack),
            classType: 'primary',
            spinnerColor: 'text-red-500',
            action: async (button, step) => {
                /*
                | Executed by the back button event.
                | Checks if the current step executes logic in its 'back' property, and if so, returns the
                | directNavigation, disableStep and errorStep methods to be used from step definitions.
                */
                if (step.back) {
                    const response = step.back(directNavigation, goBack)

                    if (response.then) {
                        await response

                        return
                    }
                }

                goBack(step.id)
            }
        },
    ]

    return res
})

// Configuration for the next button
const forwardButton = computed(() => {
    const res = [
        {
            permission: '',
            type: 'divider'
        },
        {
            icon: props.nextButtonIcon,
            label: props.nextButtonLabel,
            type: 'button',
            pulse: true,
            disabled: isNextOrBackActionDisabled(currentStep.value.disableNext),
            classType: 'primary',
            spinnerColor: 'text-red-500',
            action: async (button, step) => {
                if (step.next) {
                    const response = step.next(directNavigation, goForward)

                    if (response.then) {
                        await response

                        return
                    }
                }

                goForward(step.id)
            }
        },
    ]

    return res
})

defineExpose({
    enableStep,
    disableStep,
    errorStep,
    getCurrentStepPosition
})
</script>

<template>
    <nav aria-label="Progress">
        <div class="flex">
            <!-- Stepper section -->
            <div class="pr-4 overflow-x-scroll pt-6 w-full">
                <ol role="list" class="flex items-start">
                    <li
                        v-for="(step, stepIdx) in allSteps"
                        :key="step.name"
                        :id="`step-${stepIdx + 1}`"
                        :class="[stepIdx !== allSteps.length - 1 ? 'pr-8' : '', 'relative']">
                        <!-- Slot for complete step replacement at a specific step. -->
                        <slot
                            v-if="findSlotByName(`step-${step.id}`)"
                            :name="`step-${step.id}`" />

                        <!-- Step component with all its states -->
                        <Step
                            v-if="!findSlotByName(`step-${step.id}`)"
                            :background-color="backgroundColor"
                            :disableDirectNavitagion="disableDirectNavitagion"
                            @navigate="(stepId) => directNavigation(stepId)"
                            :isLast="!(stepIdx < allSteps.length - 1)"
                            :step-idx="stepIdx"
                            :step="step">
                            <!-- To replace the icon. -->
                            <template #icon="{ stepData }">
                                <slot
                                    :stepData="stepData"
                                    v-if="findSlotByName(`step-icon-${step.id}`)"
                                    :name="`step-icon-${step.id}`" />
                            </template>

                            <!-- To replace the name. -->
                            <template #name="{ stepData }">
                                <slot
                                    :stepData="stepData"
                                    v-if="findSlotByName(`step-name-${step.id}`)"
                                    :name="`step-name-${step.id}`" />
                            </template>
                        </Step>
                    </li>
                </ol>
            </div>

            <!-- Navigation buttons -->
            <div class="flex-shrink-0 pt-8">
                <!-- Next and previous buttons -->
                <div
                    v-for="(step, index) in allSteps"
                    :key="index">
                    <div
                        v-if="step.isCurrent"
                        class="flex justify-end ml-20">
                        <!-- Slot for additional button or content on the left of the navigation buttons of a specific step. -->
                        <div v-if="findSlotByName(`extra-left-button-${step.id}`)">
                            <slot :name="`extra-left-button-${step.id}`" />
                        </div>

                        <!-- Slot for additional button or content on the left of the navigation button of all steps -->
                        <div v-if="findSlotByName(`extra-left-button`)">
                            <slot :name="`extra-left-button`" />
                        </div>

                        <!-- Back button -->
                        <div v-if="hasNavigationButtons">
                            <!-- Slot for replace back button in all steps -->
                            <div
                                @click="backButton[0].action(backButton[1], step)"
                                v-if="findSlotByName('back-button')">
                                <slot :name="`back-button`" />
                            </div>

                            <div v-if="!findSlotByName('back-button')">
                                <!-- Slot for replace back button at a specific step -->
                                <div
                                    v-if="findSlotByName(`back-button-${step.id}`)"
                                    @click="backButton[0].action(backButton[0], step)">
                                    <slot :name="`back-button-${step.id}`" />
                                </div>

                                <!-- Default button -->
                                <GroupButtons
                                    v-if="!findSlotByName(`back-button-${step.id}`)"
                                    :step="currentStep"
                                    :buttons="backButton" />
                            </div>
                        </div>

                        <!-- Forward button -->
                        <div v-if="hasNavigationButtons">
                            <!-- Slot for replace next button in all steps -->
                            <div
                                @click="forwardButton[1].action(forwardButton[1], step)"
                                v-if="findSlotByName('next-button')">
                                <slot :name="`next-button`" />
                            </div>

                            <div v-if="!findSlotByName('next-button')">
                                <!-- Slot for replacing the next button at a specific step -->
                                <div
                                    v-if="findSlotByName(`next-button-${step.id}`)"
                                    @click="forwardButton[1].action(forwardButton[1], step)">
                                    <slot :name="`next-button-${step.id}`" />
                                </div>

                                <!-- Default button -->
                                <GroupButtons
                                    v-if="!findSlotByName(`next-button-${step.id}`)"
                                    :step="currentStep"
                                    :buttons="forwardButton" />
                            </div>
                        </div>

                        <!-- Slot for additional button or content on the right of the navigation buttons of a specific step. -->
                        <div v-if="findSlotByName(`extra-right-button-${step.id}`)">
                            <slot :name="`extra-right-button-${step.id}`" />
                        </div>

                        <!-- Slot for additional button or content on the right of the navigation button of all steps -->
                        <div v-if="findSlotByName(`extra-right-button`)">
                            <slot :name="`extra-right-button`" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- View (variable) section -->
        <div :class="`mt-8`">
            <div
                v-for="(step, index) in allSteps"
                :key="index"
                class="mt-4">
                <transition>
                    <div v-if="step.isCurrent">
                        <component
                            v-model:params="step.params"
                            :is="step.component" />
                    </div>
                </transition>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.v-enter-active {
    transition: 0.3s linear
}

.v-enter {
  transform: translate(100%, 0)
}
.v-leave-to {
  transform: translate(+100%, 0)
}

.v-enter-from,
.v-leave-from {
    transform: translate(+100%, 0)
}
</style>
