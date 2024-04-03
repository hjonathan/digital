<script setup>
import { computed } from 'vue'
import { DatePicker, Label, InputLabel, TextareaLabel } from 'form'
import { Slider } from 'layout'
import { formatDate } from 'shared'

const props = defineProps({
    open: {
        type: Boolean,
        default: () => (false)
    },
    modelValue: {
        type: Object,
        default: () => ({})
    },
    mode: {
        type: String,
        default: 'readonly'
    },
    errors: {
        type: Object,
        default: () => ({})
    },
    minDate: {
        type: String,
        default: new Date()
    }
})

const open = computed(() => {
    if (props.mode === 'readonly') {
        return true
    }

    return props.open
})

const mode = computed(() => {
    return props.mode
})

const emit = defineEmits(['update:modelValue'])

const computedValue = computed({
    get: () => props.modelValue,
    set: newValue => { emit('update:modelValue', newValue) }
})
</script>

<template>
    <!-- Form -->
    <Slider
        v-if="( mode === 'readonly' && Object.keys(modelValue).length !== 0) || mode === 'edit'"
        :class="{ '!h-min' : mode === 'readonly'  }"
        :isOpen="open">
        <div class="grid grid-cols-1">
            <div class="col-span-1 flex flex-col p-px gutter-xs">
                <!-- Requested date -->
                <InputLabel
                    v-model="computedValue.requested_delivery_date"
                    :label="$t('Requested delivery date')"
                    :placeholder="$t('Requested delivery date')"
                    :mode="mode"
                    readonly=""
                    outline
                    dense
                    class="mt-4 print-reset-mt" >
                    <template v-slot:form-field>
                        <DatePicker
                            v-if="mode === 'edit'"
                            v-model="computedValue.requested_delivery_date"
                            :placeholder="$t('Requested delivery date')"
                            size="sm"
                            outline
                            container-class="none"
                            :errors="errors && errors[`requested_delivery_date`]"
                            :minDate="minDate" />

                        <Label v-if="mode === 'readonly'">
                            {{ computedValue.requested_delivery_date ? formatDate(computedValue.requested_delivery_date) : `- ${$t('No delivery date was provided')} -` }}
                        </Label>
                    </template>
                </InputLabel>

                <!-- Instructions -->
                <TextareaLabel
                    v-model="computedValue.instructions"
                    :label="$t('Instructions')"
                    :placeholder="$t('Instructions')"
                    :mode="mode"
                    outline
                    dense
                    :error="errors && errors[`instructions`]" />
            </div>
        </div>
    </Slider>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease-in;
}

.v-enter-from,
.v-leave-from {
  opacity: 0 ;
}
</style>
