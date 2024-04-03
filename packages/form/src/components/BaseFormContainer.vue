<script setup>
/*
|--------------------------------------------------------------------------
| Base form container
|--------------------------------------------------------------------------
|
| Container for standard form elements.
|
*/

// import { ExclamationCircleIcon } from '@d/vue/24/solid'
import LabelWithTagLine from './LabelWithTagLine.vue'
import InputErrorMessage from './InputErrorMessage.vue'

defineProps({
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

    /*
    | Input
    */
    inputId: String,

    /*
    | Error
    */
    errors: [Object, String],
    errorIcon: Boolean,

    /*
    | Styles
    */
    // This prop enables or disables the responsiveness of this component.
    hasBreakpoint: {
        type: Boolean,
        default: true
    }
})
</script>

<template>
    <div :class="[containerClass ? containerClass : `air-sm`]" :id="containerId">
        <div
            class="flex"
            :class="{ 'flex-col md:flex-row h-full' : hasBreakpoint }">
            <!-- Label -->
            <div
                v-if="$slots.label"
                class="w-full mr-4 mt-[8px]"
                :class="{ 'md:w-2/5' : hasBreakpoint }">
                <LabelWithTagLine
                    :labelId="labelId"
                    :labelClass="labelClass"
                    :forId="inputId"
                    :onError="errors ? true : false">
                    <slot name="label"></slot>

                    <template #tag>
                        <slot name="tag"></slot>
                    </template>
                </LabelWithTagLine>
            </div>

            <!-- Empty space -->
            <div v-if="$slots[0]" class="w-2/5 mr-4 mt-2"></div>

            <!-- Input element -->
            <div :class="[`m-auto w-full flex-1 relative !p-0 h-full`,
                $slots.label && !$slots.empty ? 'w-3/5' : 'w-full', // For regular form elements
                !$slots.label && $slots.empty ? 'w-3/5' : '', // For buttons
                ]">
                <slot></slot>

                <!-- Extra text under input -->
                <span :class="[
                `block relative right-1 -bottom-1 text-right text-xs font-medium`,
                errors ? `text-red-900` : `text-gray-400`,
                ]">
                    <slot name="extra"></slot>
                </span>
            </div>
        </div>

        <!-- Input error message -->
        <div v-if="errors" class="mt-1 text-right">
            <InputErrorMessage v-for="error in errors" :forId="inputId" :key="error.name">
                {{ error }}
            </InputErrorMessage>
        </div>

        <!-- Error icon, hidden by default -->
        <div v-if="errors && errorIcon" :class="[`absolute -top-2 -right-2`]">
            !
            <!-- <ExclamationCircleIcon class="h-6 w-6 text-red-600" aria-hidden="true" /> -->
        </div>
    </div>
</template>
