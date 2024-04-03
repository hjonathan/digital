<script setup>
/*
|--------------------------------------------------------------------------
| Textarea
|--------------------------------------------------------------------------
|
| Wrapper around HTML's <textarea> tag.
|
*/

import { computed, ref } from 'vue'
import { uniqueId } from 'lodash'
import BaseFormContainer from './BaseFormContainer.vue'

const props = defineProps({
    /*
    | Main
    */
    modelValue: [Object, String],

    /*
    | Input
    */
    inputId: String,
    inputClass: String,
    readonly: Boolean,
    disabled: Boolean,
    placeholder: String,
    label: String,
    tag: String,
    extra: String,
    resizable: {
        type: Boolean,
        default: true
    },

    outline: Boolean,
    size: {
        type: String,
        default: 'md'
    },

    /*
    | Label
    */
    labelId: String,
    labelClass: String,

    /*
    | Error
    */
    errors: Object,
    errorIcon: Boolean,

    /*
    | Container
    */
    containerId: String,
    containerClass: String
})

const emit = defineEmits(['update:modelValue'])

// Update modelValue
const value = computed({
    get () { return props.modelValue },
    set (value) { emit('update:modelValue', value) }
})

const sizes = ref({
    sm: 'textarea-sm',
    md: 'textarea',
    xl: 'textarea-xl'
})

// Assign an ID if not given one
const inputId = props.inputId ?? uniqueId('textarea_')
</script>

<template>
    <BaseFormContainer
        :inputId="inputId"
        :inputClass="inputClass"
        :disabled="disabled"
        :readonly="readonly"
        :containerId="containerId"
        :containerClass="containerClass"
        :labelId="labelId"
        :labelClass="labelClass"
        :errors="errors"
        :errorIcon="errorIcon">
        <textarea
            :placeholder="placeholder"
            v-model="value"
            :id="inputId"
            :class="
                [
                    {
                        [sizes[size]]: true,
                        '!shadow-none border-2': outline,
                        'border-none': !outline
                    },
                    { '!bg-red-100': errors },
                    {'resize-none' : !resizable}, inputClass,
                    { '!cursor-not-allowed' : disabled || readonly }]
                "
            :disabled="disabled || readonly">
        </textarea>

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
