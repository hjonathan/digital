<script setup>
import { Label, Input } from 'form'
import { defineModel } from 'shared'

const props = defineProps({
    mode: {
        type: String,
        default: 'readonly'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: ''
    },
    modelValue: {
        type: [String, Number, Object],
        default: ''
    },
    outline: {
        type: Boolean,
        default: false
    },
    dense: {
        type: Boolean,
        default: false
    },

    whiteMode: Boolean,

    /* Input props */
    type: {
        type: String,
        default: 'input'
    },
    inputLabelClass: String,

    labelClass: String,

    inputClass: String,

    inputLabelLeft: String,

    min: String,

    max: String,

    inputExtraLabelLeft: String,

    error: Object,

    readonly: Boolean,
    hasBorder: {
        type: Boolean,
        default: true
    }
})

const localModel = defineModel('modelValue')
</script>

<template>
    <div>
        <div :class="`row cols-6 input-label-gutter ${ whiteMode && hasBorder? 'border-b border-gray-300 pb-2 print-reset-padding-bottom' : ''}`">
            <div class="col-2/6">
                <div :class="`col-span-5 flex flex-col print-custom-leading`">
                    <Label
                        :class="`${dense ? 'py-2' : 'py-3' } ${whiteMode ? '!font-light text-gray-800 !px-0' : 'bg-gray-200'} px-3 ${labelClass} ${ error ? 'input-label-error' : ''} ${ mode === 'edit' ? 'mt-2' : 'mt-0' }`">
                        {{ label }}
                    </Label>
                </div>
            </div>

            <div
                :class="[ 'col-4/6', whiteMode ? 'text-end pr-4 print-reset-padding-right' : '', mode === 'readonly' ? 'p-2' : '', 'print-custom-leading']">
                <slot
                    name="form-field">
                    <Label
                        v-if="mode === 'readonly'"
                        :class="`${dense ? 'my-2' : 'py-3' } ${inputLabelClass || ''} ${ whiteMode ? '!px-0 !mx-0' : '' }`">
                        {{ inputExtraLabelLeft }}{{ localModel }}
                    </Label>

                    <Input
                        v-if="['edit', 'disabled'].includes(mode)"
                        container-class="none"
                        v-model="localModel"
                        :type="type"
                        :placeholder="label"
                        :size="dense? 'sm' : 'md'"
                        :outline="outline"
                        :inputClass="inputClass"
                        :min="min"
                        :max="max"
                        :inline-label-left="inputLabelLeft"
                        :readonly="mode === 'disabled'"
                        :errors="error && []"
                        :class="{ 'mt-2' : mode ==='edit' }" />
                </slot>
            </div>
        </div>
    </div>
</template>
