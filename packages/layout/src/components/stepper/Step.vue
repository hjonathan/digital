<script setup>
import { computed, onMounted, ref } from 'vue'
import { CheckIcon } from '@heroicons/vue/20/solid'

import SvgIcon from '@jamescoyle/vue-icon'

import {
    mdiExclamationThick,
    mdiCancel,
    mdiContentSave
} from '@mdi/js'

const props = defineProps({
    step: Object,
    stepIdx: Number,
    disableDirectNavitagion: Boolean,
    isLast: Boolean,
    backgroundColor: String
})

const defaultStepSeparatorWidth = 75
const defaultStepIdPrefix = 'center-step'

const type = computed(() => {
    return props.step.status
})

const computedCircleClasses = computed(() => {
    const baseClasses = [
        'relative',
        'flex',
        'h-7', // This class determines the height of the steps
        'w-7', // This class determines the width of the steps
        'items-center',
        'justify-center',
        'rounded-full',
        'group',
    ]

    if (type.value === 'complete') {
        baseClasses.push('bg-primary-400 hover:bg-primary-600')
    }

    if (type.value === 'error') {
        baseClasses.push('bg-error-200 hover:bg-error-300 border-error-500 border-2 pulse')
    }

    if (type.value === 'warning') {
        baseClasses.push('bg-warning-200 hover:bg-warning-300 border-warning-500 border-2')
    }

    if (type.value === 'disabled') {
        baseClasses.push('bg-gray-200 !cursor-not-allowed border-gray-300 border-2')
    }

    if (type.value === 'current') {
        baseClasses.push('border-2 border-indigo-600 !bg-white')
    }

    if (type.value === 'save') {
        baseClasses.push('border-2 border-gray-300 bg-gray-200')
    }

    if (type.value === 'upcoming') {
        baseClasses.push('group border-2 border-gray-300 bg-white hover:border-gray-400')
    }

    return baseClasses
})

onMounted(() => {
    defineLinePosition()
})

const distanceFromTopForLine = ref(null)

// Defines the position of the line
const defineLinePosition = () => {
    const lineWidth = 2 // Width of the horizontal status line

    const step = document.querySelector('.step')

    // The position of the line is determined by the height of the step divided by two, minus the width of the line.
    step && (distanceFromTopForLine.value = (step.offsetHeight - lineWidth) / 2)
}

const emit = defineEmits(['navigate'])

// Gets width for separator between steps
const getWidth = () => {
    let width = defaultStepSeparatorWidth

    let finalRect = null

    let initialRect = null

    // Gets the element from which the step separator will start.
    const inicialStep = document.getElementById(`${defaultStepIdPrefix}-${props.stepIdx + 1}`)

    inicialStep && (initialRect = inicialStep.getBoundingClientRect())

    // Gets the element where the step separator will end.
    const finalStep = document.getElementById(`${defaultStepIdPrefix}-${props.stepIdx + 2}`)

    finalStep && (finalRect = finalStep.getBoundingClientRect())

    initialRect && finalRect && (width = finalRect.left - initialRect.left)

    return `${width}px`
}
</script>

<template>
    <div class="flex flex-col items-center !w-min">
        <!-- Line -->
        <!-- A width of 170% gives us a 70% individual growth margin for each step. -->
        <div
            v-if="!isLast"
            style="transform: translate(+50%, +50%)"
            :style="{ top: distanceFromTopForLine + 'px', width: getWidth() }"
            class="absolute"
            aria-hidden="true">
            <div
                :class="[
                    type === 'complete' && !isLast ?
                    'bg-indigo-600 h-0.5' :
                    'h-0.5',
                    {
                        [backgroundColor] :  isLast,
                        'bg-gray-300' : !isLast,
                    }
                ]"
                class="w-content" />
        </div>

        <!-- Circle -->
        <a
            :id="`center-step-${stepIdx + 1}`"
            class="step"
            @click="disableDirectNavitagion || step.status === 'disabled' ? '' : emit('navigate', step.id)"
            :class="[
                computedCircleClasses,
                { 'cursor-pointer' :  !disableDirectNavitagion }
            ]">
            <!-- Icons for all states -->
            <slot name="icon" :stepData="step">
                <!-- Complete -->
                <CheckIcon
                    v-if="type === 'complete'"
                    class="h-5 w-5 text-white"
                    aria-hidden="true" />

                <!-- Current -->
                <span
                    v-if="type === 'current'"
                    class="h-2.5 w-2.5 rounded-full bg-indigo-600"
                    aria-hidden="true" />

                <!-- Upcoming -->
                <span
                    v-if="type === 'upcoming'"
                    class="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                    aria-hidden="true" />

                <!-- Save state -->
                <svg-icon
                    v-if="type === 'save'"
                    type="mdi"
                    :path="mdiContentSave"
                    class="h-3 w- rounded-full text-gray-500/80 hover:text-gray-600/80" />

                <!-- Error, warning and disabled -->
                <svg-icon
                    v-if="type === 'error' || type === 'warning' || type === 'disabled'"
                    type="mdi"
                    :path="type === 'disabled' ? mdiCancel : mdiExclamationThick"
                    :class="{
                        'text-error-600' : type === 'error',
                        'text-warning-600' : type === 'warning',
                        'text-gray-400 opacity-0 group-hover:opacity-100 transition' : type === 'disabled'
                    }"
                    class="h-6 w-6 rounded-full" />
            </slot>

            <!-- Accesilibity -->
            <span class="sr-only">
                {{ $t(step.name) }}
            </span>
        </a>

        <slot
            name="name"
            :stepData="step">
            <!-- Step label -->
            <div
                :class="{
                    'text-gray-600' : type === 'complete',
                    'text-gray-300' : type === 'disabled',
                    'text-error-600' : type === 'error',
                    'text-warning-600' : type === 'warning',
                    'text-primary-600' : type === 'current',
                    }"
                class="select-none text-xs text-gray-500 font-medium whitespace-nowrap mt-2">
                {{ $t(step.name) }}
            </div>
        </slot>
    </div>
</template>

<style>
/* Styles for an element with a pulse animation */
.pulse{
    animation: animate-pulse 3s linear infinite;
    cursor: pointer;
}

/*
| @keyframes named animate-pulse  has 4 selectors: 0%, 40%,  80%, 100%.
| The number 20 in pixels determines the radius of the maximum size to which the 'pulse' shadow will grow.
*/
@keyframes animate-pulse{
    0%{
        box-shadow: 0 0 0 0 #dc2626,  0 0 0 0 #dc2626;
    }

    40%{
        box-shadow: 0 0 0 20px rgba(255,109,74,0.0);
    }

    80%{
        box-shadow: 0 0 0 20px rgba(255,109,74,0.0);
    }

    100%{
        box-shadow: 0 0 0 20px rgba(255,109,74,0.0);
    }
}
</style>
