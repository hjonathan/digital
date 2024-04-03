<script setup>
/*
|--------------------------------------------------------------------------
| ToogleSwitch
|--------------------------------------------------------------------------
|
| Component that allows defining boolean values in forms.
|
*/

import { computed } from 'vue'
import { Switch } from '@headlessui/vue'
import BaseFormContainer from './BaseFormContainer.vue'

const props = defineProps({
    /*
    | Main
    */
    elements: Array,
    modelValue: [Array, Boolean, String],

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
    | Error
    */
    errors: Object,
    errorIcon: Boolean,

    /*
    | Styles
    */
    justifyBeetween: {
        type: Boolean,
        default: false
    },

    // This prop enables or disables the responsiveness of the BaseFormContainer component.
    hasBreakpoint: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    hasBorder: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'clickInToggle'])

const checked = computed({
    get () { return props.modelValue },
    set (value) { emit('update:modelValue', value) }
})
</script>

<template>
    <BaseFormContainer
        :containerId="containerId"
        :containerClass="containerClass"
        :labelId="labelId"
        :labelClass="labelClass"
        :errors="errors"
        :has-breakpoint="hasBreakpoint"
        :errorIcon="errorIcon">
        <div
            class="card flex justify-content-center"
            :class="{ 'md:justify-end' : justifyBeetween}">
            <div class="flex flex-wrap flex-column gap-8">
                <Switch
                    :disabled="disabled"
                    v-model="checked"
                    @click="emit('clickInToggle')"
                    class="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center
                    rounded-full focus:outline-none">
                    <span class="sr-only">{{ $t('Toggle') }}</span>

                    <span
                        aria-hidden="true"
                        class="pointer-events-none absolute h-full w-full rounded-md bg-transparent" />

                    <span
                        aria-hidden="true"
                        :class="[checked ?
                        'bg-indigo-600':
                        'bg-gray-200',
                        'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out',
                        { 'border !border-blue-800' : hasBorder }]" />

                    <span
                        aria-hidden="true"
                        :class="[checked ?
                        'translate-x-5':
                        'translate-x-0',
                        { '!border-blue-800' : hasBorder }]"
                        class="pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border
                        border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out" />
                </Switch>
            </div>
        </div>

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
