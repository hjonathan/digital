<script setup>
/*
|--------------------------------------------------------------------------
| Input
|--------------------------------------------------------------------------
|
| Wrapper around HTML's <input> tag.
|
| Includes an 'inlineLabelRight' to show 'inline' information (right).
| Includes an 'inlineLabelLeft' to show 'inline' information (left).
| If inline labels are included, the component will automatically
| calculate additional paddings to prevent content overlapping.
|
*/

import { ref, computed, onMounted, onUpdated, nextTick } from 'vue'
import { uniqueId } from 'lodash'

import Label from './Label.vue'
import BaseFormContainer from './BaseFormContainer.vue'

const props = defineProps({
    /*
    | Main
    */
    modelValue: [Number, String, Date],
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
    type: { type: String, default: 'text' },
    readonly: Boolean,
    disabled: Boolean,
    max: [String, Number],
    min: [String, Number],
    step: String,
    placeholder: String,
    label: String,
    tag: String,
    extra: String,
    inlineLabelLeft: String,
    inlineLabelRight: String,

    inlineLabelLeftClass: String,
    inlineLabelLeftStyle: String,

    inlineLabelRightClass: String,
    inlineLabelRightStyle: String,

    outline: Boolean,
    size: {
        type: String,
        default: 'standard'
    },

    /*
    | Error
    */
    errors: [Object, String],
    errorIcon: Boolean
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Update modelValue
const value = computed({
    get () { return props.modelValue },
    set (value) { emit('update:modelValue', value) }
})

// Assign an ID if not given one
const inputId = props.inputId ?? uniqueId()

// Refs
const inputRef = ref()
const inlineLabelLeftRef = ref()
const inlineLabelRightRef = ref()

// Style
const inputStyle = ref()
const inlineLabelLeftStyle = ref()

const sizes = ref({
    sm: 'input-sm',
    md: 'input-md',
    standard: 'input',
    xl: 'input-xl'
})

const resizePositionElements = () => {
    // Modify the paddings to prevent content overlapping with the labels
    const leftOffset = inlineLabelLeftRef.value.offsetWidth > 0 ? inlineLabelLeftRef.value.offsetWidth + 17 : 10
    const rightOffset = inlineLabelRightRef.value.offsetWidth > 0 ? inlineLabelRightRef.value.offsetWidth + 17 : 10
    inputStyle.value = `padding-left: ${leftOffset}px; padding-right: ${rightOffset}px;`

    // Set left label x axis position to set it on top of the input
    const xPosition = inputRef.value.offsetLeft
    inlineLabelLeftStyle.value = `left: ${xPosition}px;`
}

// Control content overlapping inlineLabelLeftRef and inlineLabelRightRef
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
        <input
            v-model="value" :id="inputId"
            :class="[{
                    [sizes[size]]: true,
                    '!bg-red-100': errors,
                    '!bg-gray-300 !cursor-not-allowed' : readonly,
                    '!shadow-none border-2': outline,
                    'border-none': !outline
                }, inputClass]"
            :type="type"
            :disabled="disabled || readonly"
            :max="max"
            :min="min"
            :step="step"
            :placeholder="placeholder"
            :style='inputStyle'
            ref="inputRef" />

        <span
            v-show="$slots.inlineLabelRight || inlineLabelLeft"
            :class="`absolute left-0 ml-3 pointer-events-none ${inlineLabelLeftClass}`"
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
            :class="`absolute right-0 mr-3 pointer-events-none ${inlineLabelRightClass}`"
            :style="`top: .65rem; ${inlineLabelRightStyle}`"
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

        <template #tag  v-if="$slots.tag || tag">
            <slot name="tag">
                {{ tag }}
            </slot>
        </template>

        <template #extra  v-if="$slots.extra || extra">
            <slot name="extra">
                {{ extra }}
            </slot>
        </template>
    </BaseFormContainer>
</template>
