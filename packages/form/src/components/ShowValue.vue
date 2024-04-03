<script setup>
/*
|--------------------------------------------------------------------------
| Shows value
|--------------------------------------------------------------------------
|
| Shows label and value.
| Will use ShowOneValue to show one record and ShowMultipleValues to show
| multiple records.
|
*/
import { ref, nextTick } from 'vue'

import { uniqueId } from 'lodash'

import Label from './Label.vue'
import BaseFormContainer from './BaseFormContainer.vue'

const props = defineProps({
    /*
    | Main
    */
    modelValue: [String, Number],

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
    label: String,
    tag: String,
    extra: String,

    /*
    | Value
    */
    valueId: String,
    valueClass: String,
    justifyEnd: {
        type: Boolean,
        default: false
    }
})

// Refs
const inputRef = ref()
const inlineLabelLeftRef = ref()
const inlineLabelRightRef = ref()

// Style
const inputStyle = ref()
const inlineLabelLeftStyle = ref()

// Control content overlapping
nextTick(() => {
    // Modify the paddings to prevent content overlapping with the labels
    const leftOffset = inlineLabelLeftRef.value.offsetWidth > 0 ? inlineLabelLeftRef.value.offsetWidth + 17 : 10
    const rightOffset = inlineLabelRightRef.value.offsetWidth > 0 ? inlineLabelRightRef.value.offsetWidth + 17 : 10
    inputStyle.value = `padding-left: ${leftOffset}px; padding-right: ${rightOffset}px;`

    // Set left label x axis position to set it on top of the input
    const xPosition = inputRef.value.offsetLeft
    inlineLabelLeftStyle.value = `left: ${xPosition}px;`
})

const valueId = props.valueId ?? uniqueId('showvalue_') // Assign an ID if not given one
</script>

<template>
    <BaseFormContainer
        :inputId="valueId"
        :inputClass="valueClass"
        :containerId="containerId"
        :labelClass="labelClass"
        :containerClass="containerClass"
        :labelId="labelId">
        <!-- Main content -->
        <span
            class="w-full block"
            :labelId="valueId"
            :class="[valueClass, { 'flex justify-end' : justifyEnd }]"
            :style='inputStyle'
            ref="inputRef">
            {{ modelValue }}
            <slot></slot>
        </span>

        <template #label v-if="$slots.label || label">
            <div class="!-mt-2">
                <slot name="label">
                    {{ label }}
                </slot>
            </div>
        </template>

        <span
            class="absolute z-10 left-0 ml-3 pointer-events-none"
            :style="`${inlineLabelLeftStyle}`"
            ref="inlineLabelLeftRef">
            <Label>
                <slot name="inlineLabelLeft"></slot>
            </Label>
        </span>

        <span
            class="absolute z-10 right-0 mr-3 pointer-events-none"
            ref="inlineLabelRightRef">
            <Label>
                <slot name="inlineLabelRight"></slot>
            </Label>
        </span>

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
