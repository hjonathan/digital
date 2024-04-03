<script setup>
/*
|--------------------------------------------------------------------------
| DatePicker
|--------------------------------------------------------------------------
|
| Wrapper around PrimeVue's Calendar component.
*/

import { ref, nextTick, computed, onMounted, onUpdated } from 'vue'
import { uniqueId } from 'lodash'

import Label from './Label.vue'
import BaseFormContainer from './BaseFormContainer.vue'

import Calendar from 'primevue/calendar'

const props = defineProps({
    /*
    | Main
    */
    modelValue: [Number, String, Date, Array],
    options: Object,

    /*
    | Container
    */
    containerId: String,
    containerClass: String,

    /*
    | Label
    */
    labelId: String,
    labelClass: String,

    /*
    | Input
    */
    inputId: String,
    inputClass: String,
    readonly: Boolean,
    disabled: Boolean,
    max: String,
    min: String,
    step: String,
    placeholder: String,
    label: String,
    tag: String,
    extra: String,
    inlineLabelLeft: String,
    inlineLabelRight: String,

    outline: Boolean,
    size: {
        type: String,
        default: 'md'
    },

    showTime: {
        type: Boolean,
        default: false
    },

    // The supported values are 12 and 24 hours format.
    hourFormat: {
        type: String,
        default: '12'
    },
    dateFormat: {
        type: String,
        default: ''
    },
    selectionMode: {
        type: String,
        default: 'single'
    },

    /*
    | Error
    */
    errors: [Object, String],
    errorIcon: Boolean,

    // If no minimum date is specified, the current date is assigned by default as the minimum selectable date.
    minDate: {
        type: Date,
        default: new Date()
    },

    inlineCalendar: {
        type: Boolean,
        default: false
    }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Update modelValue
const value = computed({
    get () { return props.modelValue },
    set (value) { emit('update:modelValue', value) }
})

// Input
const inputId = props.inputId ?? uniqueId() // Assign an ID if not given one

// Refs
const inputRef = ref()
const inlineLabelLeftRef = ref()
const inlineLabelRightRef = ref()

const sizes = ref({
    sm: 'input-sm',
    md: 'input',
    xl: 'input-xl'
})

// Style
const inputStyle = ref()
const inlineLabelLeftStyle = ref()

const resizePositionElements = () => {
    // Modify the paddings to prevent content overlapping with the labels
    const leftOffset = inlineLabelLeftRef.value.offsetWidth > 0 ? inlineLabelLeftRef.value.offsetWidth + 17 : 10
    const rightOffset = inlineLabelRightRef.value.offsetWidth > 0 ? inlineLabelRightRef.value.offsetWidth + 17 : 10
    inputStyle.value = `padding-left: ${leftOffset}px; padding-right: ${rightOffset}px;`

    // Set left label x axis position to set it on top of the input
    const xPosition = inputRef.value.offsetLeft
    inlineLabelLeftStyle.value = `left: ${xPosition}px;`
}

// Control content overlapping
onUpdated(() => {
    resizePositionElements()
})

onMounted(() => {
    nextTick(() => {
        resizePositionElements()
    })
})
</script>

<template>
    <BaseFormContainer
        :containerId="containerId"
        :containerClass="containerClass"
        :labelId="labelId"
        :labelClass="labelClass"
        :inputId="inputId"
        :inputClass="inputClass"
        :readonly="readonly"
        :disabled="disabled"
        :errors="errors"
        :errorIcon="errorIcon">
        <Calendar
            :inline="inlineCalendar"
            :minDate="minDate"
            :inputClass="['!border-0 !px-0 !py-0 !ring-transparent !shadow-none placeholder:text-gray-400 placeholder:text-base !w-full',
            {' !bg-red-100' : errors, '!cursor-not-allowed !bg-gray-300' : readonly || disabled }]"
            v-model="value"
            :id="inputId"
            :class="['bg-white', {
                [sizes[size]]: true,
                '!bg-red-100': errors,
                '!bg-gray-300 !cursor-not-allowed' : readonly || disabled,
                '!shadow-none border-2': outline,
                'border-none': !outline
                }, inputClass]"
            :disabled="disabled || readonly"
            :placeholder="placeholder"
            :style='inputStyle'
            ref="inputRef"
            :showTime="showTime"
            :hourFormat="hourFormat"
            :dateFormat="dateFormat"
            :selection-mode="selectionMode" />

        <span
            v-show="$slots.inlineLabelRight || inlineLabelLeft"
            class="absolute z-10 left-0 ml-3 pointer-events-none"
            :style="`top: .65rem; ${inlineLabelLeftStyle}`"
            ref="inlineLabelLeftRef">
            <Label :onError="errors ? true : false">
                <slot name="inlineLabelLeft">
                    {{ inlineLabelLeft }}
                </slot>
            </Label>
        </span>

        <span
            v-show="$slots.inlineLabelRight || inlineLabelRight"
            class="absolute z-10 right-0 mr-3 pointer-events-none"
            style="top: .65rem"
            ref="inlineLabelRightRef">
            <Label :onError="errors ? true : false">
                <slot name="inlineLabelRight">
                    {{ inlineLabelRight }}
                </slot>
            </Label>
        </span>

        <template #label v-if="$slots.label || label">
            <slot name="label">
                {{ label }}
            </slot>
        </template>

        <template #tag v-if="$slots.tag || tag">
            <slot name="tag">
                {{ tag }}
            </slot>
        </template>

        <template #extra v-if="$slots.extra || extra">
            <slot name="extra">
                {{ extra }}
            </slot>
        </template>
    </BaseFormContainer>
</template>
