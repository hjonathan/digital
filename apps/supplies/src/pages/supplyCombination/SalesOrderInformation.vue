<script setup>
import { computed } from 'vue'
import { Title } from 'layout'
import { Input } from 'form'

const props = defineProps({
    modelValue: [Object, String],
    errors: Object
})

const emit = defineEmits(['update:modelValue'])

const data = computed({
    get: () => props.modelValue,
    set: newData => emit('update:modelValue', newData)
})
</script>

<template>
    <Title
        :title="$t('Sales order information')"
        :hasBorderBottomLine="false"
        titleType="h2"
        class="mt-8" />

    <Input
        v-model="data"
        :errors="errors?.sales_order_number"
        :label="$t('Sales order')"
        :placeholder="$t('Sales order number')"
        class="!mt-2 mb-8" />
</template>
