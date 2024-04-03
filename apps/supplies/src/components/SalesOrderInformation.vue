<script setup>
import { computed } from 'vue'
import { Title } from 'layout'
import { Input, InputLabel } from 'form'

const props = defineProps({
    modelValue: [Object, String],
    errors: Object,
    mode: String
})

const emit = defineEmits(['update:modelValue'])

const data = computed({
    get: () => props.modelValue,
    set: newData => emit('update:modelValue', newData)
})
</script>

<template>
    <InputLabel
        v-model="data"
        :label="$t('Sales order information')"
        :mode="mode"
        :error="errors?.sales_order_number"
        outline
        dense />
</template>
