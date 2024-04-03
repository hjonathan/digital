<script setup>
/*
|--------------------------------------------------------------------------
| WrapperField
|--------------------------------------------------------------------------
|
| Allows wrapping PrimeVue components with the BaseFormContainer component.
|
*/

import { uniqueId } from 'lodash'

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

    /*
    | Value
    */
    valueId: String,
    valueClass: String,

    /*
    | Errors
    */
    errors: Object,
    errorIcon: Boolean
})

// Assign an ID if not given one
const valueId = props.valueId ?? uniqueId('showvalue_')
</script>

<template>
    <BaseFormContainer
        :inputId="valueId"
        :inputClass="valueClass"
        :containerId="containerId"
        :labelClass="labelClass"
        :containerClass="containerClass"
        :labelId="labelId"
        :errors="errors"
        :errorIcon="errorIcon">

        <!-- Main content -->
        <span :labelId="valueId" :labelClass="valueClass">
            {{ modelValue }}
        </span>

        <slot></slot>

        <template #label v-if="$slots.label">
            <slot name="label"></slot>
        </template>

        <template #tag>
            <slot name="tag"></slot>
        </template>

        <template #extra>
            <slot name="extra"></slot>
        </template>
    </BaseFormContainer>
</template>
