<script setup>
/*
|--------------------------------------------------------------------------
| CustomDatePicker Component:
|--------------------------------------------------------------------------
| This Vue component represents a date picker with additional features.
|
| Functionality:
| * Displays a trigger button to open the date picker.
| * Supports dynamic label size and action button size.
| * Provides a customizable date picker with validation and error handling.
| * Offers the ability to cancel date selection.
|
| Usage Example:
|    <CustomDatePicker
|       v-model="selectedDate"
|       :error="dateError"
|       :hasSeparators="true"
|       :labelSize="'text-lg'"
|       :actionButtonSize="'text-base'" />
|
*/

import { onMounted, ref } from 'vue'
import WrapperField from './WrapperField.vue'
import DatePicker from './DatePicker.vue'
import { defineModel } from 'shared'

const props = defineProps({
    // Object representing the error state.
    error: Object,

    // Value of the date model.
    modelValue: [String, Date],

    // Boolean indicating whether separators should be displayed.
    hasSeparators: {
        type: Boolean,
        default: true
    },

    // Name of the permission. Defaults to 'inventory.home.actions.custom_date'.
    permissionName: {
        type: String,
        default: 'inventory.home.actions.custom_date'
    },

    // Size of the label text. Defaults to 'text-lg'.
    labelSize: {
        type: String,
        default: 'text-lg'
    },

    // Size of the action button text. Defaults to 'text-base'.
    actionButtonSize: {
        type: String,
        default: 'text-base'
    }
})

// Ref to control the visibility of the input.
const showInput = ref(false)

// Emits the 'update:modelValue' event.
defineEmits(['update:modelValue'])

// Model binding for the input value.
const inputValue = defineModel('modelValue')

// Hides input and resets value
const hideInput = () => {
    showInput.value = false

    inputValue.value = null
}

onMounted(() => {
    if (props.modelValue) {
        showInput.value = true
    }
})
</script>

<template>
    <!-- Main section -->
    <section class="full">
        <!-- Separator line -->
        <hr
            v-if="hasSeparators"
            class="air" />

        <!-- WrapperField component -->
        <WrapperField
            :errors="error"
            :class="{'pb-2' : hasSeparators }">
            <!-- Input trigger button -->
            <div class="w-full flex justify-end">
                <!-- Trigger button -->
                <span
                    v-if="!showInput"
                    :class="actionButtonSize"
                    class="link primary cursor-pointer"
                    @click="showInput = true">
                    {{ $t('Select date') }}
                </span>
            </div>

             <!-- Date picker component with transition -->
            <Transition>
                <DatePicker
                    v-if="showInput"
                    v-model="inputValue"
                    :minDate="null"
                    :placeholder="$t(`Select custom date`)"
                    :errors="error"
                    inputClass="bg-white !my-0"
                    dateFormat="yy-mm-dd"
                    hourFormat="24"
                    showTime
                    class="!my-0" />
            </Transition>

            <!-- Cancel button displayed when the date picker is open -->
            <template #extra>
                <Transition>
                    <span
                        class="cursor-pointer text-error-600 hover:underline"
                        v-if="showInput"
                        @click="hideInput()">
                        {{ $t(`Cancel`) }}
                    </span>
                </Transition>
            </template>

            <!-- Label displayed when the date picker is open -->
            <template #label>
                <Transition>
                    <span
                        v-if="showInput"
                        :class="labelSize">
                        {{ $t('Select custom date') }}
                    </span>
                </Transition>
            </template>
        </WrapperField>

        <!-- Separator line -->
        <hr
            v-if="hasSeparators"
            class="air" />
    </section>
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
