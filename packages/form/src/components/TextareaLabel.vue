<script setup>
import { Label, TextArea } from 'form'
import { defineModel } from 'shared'

const props = defineProps({
    mode: {
        type: String,
        default: 'readonly'
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

    labelClass: String,

    inputClass: String,

    inputLabelLeft: String,

    min: String,

    max: String,

    inputExtraLabelLeft: String,

    error: Object
})

const localModel = defineModel('modelValue')
</script>

<template>
    <div>
        <div :class="`row cols-6 input-label-gutter ${ whiteMode ? 'border-b border-gray-300 pb-2 print-reset-padding-bottom' : ''}`">
            <div :class="`col-2/6 ${ error ? 'text-red-500' : ''}`">
                <div :class="`col-span-5 flex flex-col print-custom-leading`">
                    <Label
                    :class="`${dense ? 'py-2' : 'py-3' } ${whiteMode ? '!font-light text-gray-800 !px-0' : 'bg-gray-200'} px-3 ${labelClass} ${ error ? 'input-label-error' : ''}`">
                        {{ label }}
                    </Label>
                </div>
            </div>

            <div
                :class="[ 'col-4/6', whiteMode ? 'items-end' : ' ', mode === 'readonly' ? 'p-2' : 'print-custom-leading']">
                <slot name="form-field">
                    <Label
                        v-if="mode === 'readonly'"
                        class="print-custom-leading"
                        :class="`${dense ? 'py-2' : 'py-3' } ${ whiteMode ? '!px-0' : '' }`">
                        {{ inputExtraLabelLeft }}{{ localModel }}
                    </Label>

                    <TextArea
                        v-if="mode === 'edit'"
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
                        :errors="error && []" />
                </slot>
            </div>
    </div>
</div>
</template>
