<script setup>
import { computed } from 'vue'
import { Slider } from 'layout'
import { Input, Label } from 'form'

const props = defineProps({
    mode: String,
    modelValue: Number,
    errors: Object,
    openForm: Boolean,
    show_view: Boolean
})

const showInput = computed(() => {
    if (props.mode === 'readonly') {
        return true
    }

    return props.openForm
})

const emit = defineEmits(['update:modelValue'])

const computedValue = computed({
    get: () => props.modelValue,
    set: newValue => emit('update:modelValue', newValue)
})

const remove = () => {
    computedValue.value = null

    props.errors.shipping_cost = null
}

defineExpose({
    remove
})
</script>

<template>
    <Slider
        :isOpen="showInput">
        <div
            v-if="!show_view"
            class="flex flex-col px-px pb-4">
            <Input
                :readonly="mode === 'readonly'"
                v-model="computedValue"
                :errors="errors.shipping_cost"
                :label="$t('Shipping cost')"
                :placeholder="$t('Shipping cost')"
                :inputClass="'text-right'"
                type="number"
                min="0"
                inline-label-left="$"
                class="!mt-2" />
        </div>

        <div
            v-if="show_view"
            class="flex justify-between">
            <Label>
                {{ $t('Shipping cost') }}
            </Label>

            <span>
                ${{ computedValue || 0 }}
            </span>
        </div>
    </Slider>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
  opacity: 0;
}
</style>
