<script setup>
/*
| Component that has the Waste property, reason, and a cancel button to show or hide the component.
*/

import { computed, ref, watch } from 'vue'
import { Input, Treeselect } from 'form'

const props = defineProps({
    wasteValue: Number,
    reasonValue: Number,
    errors: Object,
    measure: String,
    reasonsOptions: [Object, Number],
    hasSeparators: {
        type: Boolean,
        default: true
    },
    labelSize: {
        type: String,
        default: 'text-lg'
    },
    actionButtonSize: {
        type: String,
        default: 'text-base'
    },
    forceShowInput: Boolean
})

const showInput = ref(false)

const emit = defineEmits(['update:wasteValue', 'update:reasonValue'])

const computedWasted = computed({
    get: () => props.wasteValue,
    set: newValue => { emit('update:wasteValue', newValue) }
})

const computedReason = computed({
    get: () => props.reasonValue,
    set: newValue => { emit('update:reasonValue', newValue) }
})

// Hides inputs and reset value
const hideInput = () => {
    showInput.value = false

    computedWasted.value = null

    computedReason.value = null
}

watch(
    () => props.forceShowInput,
    () => {
        showInput.value = true
    }
)
</script>

<template>
    <div>
        <hr
            v-if="hasSeparators"
            class="air mb-8" />

        <div class="w-full flex justify-end">
            <a
                @click="showInput = true"
                v-if="!showInput"
                :class="actionButtonSize"
                class="link primary">
                {{ $t('Add waste') }}
            </a>
        </div>

        <Transition>
            <div v-if="showInput">
                <Input
                    v-model="computedWasted"
                    inputClass="text-right"
                    :type="'number'"
                    class="!my-0"
                    :step="'1'"
                    :min="'0'"
                    :errors="errors?.waste">
                    <template #inlineLabelRight>
                        {{ $t(measure) }}
                    </template>

                    <template #label>
                        <span :class="labelSize">
                            {{ $t('Waste') }}
                        </span>
                    </template>
                </Input>

                <!-- Reason -->

                <Treeselect
                    :label="'Reason'"
                    :errors="errors?.reason_id"
                    v-model="computedReason"
                    :options="reasonsOptions"
                    placeholder="Select Item"
                    >

                    <template #extra>
                        <span
                            class="cursor-pointer text-error-600 hover:underline"
                            @click="hideInput()">
                            {{ $t(`Cancel waste`) }}
                        </span>
                    </template>
                </Treeselect>
            </div>
        </Transition>
    </div>
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
