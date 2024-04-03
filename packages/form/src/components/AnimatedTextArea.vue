<script setup>
import { computed } from 'vue'
import { Slider } from 'layout'
import { TextArea, Label } from 'form'

const props = defineProps({
    open: Boolean,
    modelValue: String,
    mode: String,
    placeholder: String,
    defaultMessage: {
        type: String,
        default: 'Empty data'
    },
    errors: Object
})

const open = computed(() => {
    if (props.mode === 'readonly') {
        return true
    }

    return props.open
})

const emit = defineEmits(['update:modelValue'])

const computedValue = computed({
    get: () => props.modelValue,
    set: newValue => { emit('update:modelValue', newValue) }
})
</script>

<template>
    <Slider
        v-if="( mode === 'readonly') || mode === 'edit'"
        :isOpen="open">
        <div class="flex flex-col p-px pb-2">
            <TextArea
                v-show="mode === 'edit'"
                v-model="computedValue"
                :placeholder="placeholder || $t('Note')"
                :errors="errors" />

            <Label
                v-if="mode === 'readonly'"
                class="py-2 print-reset-py">
                {{ computedValue || `- ${ defaultMessage } -` }}
            </Label>
        </div>
    </Slider>
</template>
