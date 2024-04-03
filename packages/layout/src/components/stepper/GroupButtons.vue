<script setup>
import { watch, ref } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import SpinnerStep from '../Spinner.vue'

const props = defineProps({
    buttons: Object,
    step: Object
})

const buttons = ref(props.buttons)

// Watch for changes in the 'buttons' prop and update the 'buttons' ref accordingly
watch(() => props.buttons, () => {
    buttons.value = props.buttons || []
})

// Determine if the button has a valid type (default is 'button')
const typeButton = (button) => {
    if (button.type == null || button.type === undefined || button.type === 'button') {
        return true
    }

    return false
}

// Check if the button is disabled (default is false)
const disabled = (button) => {
    if (button.disabled == null || button.disabled === undefined || button.disabled === false) {
        return false
    }

    return true
}

// Get the spinner color from the button, or use a default color if not specified
const spinnerColor = (button) => {
    return button.spinnerColor || 'text-gray-200'
}

// Handle button click, set disabled and spinner states, execute action, and reset states
const click = async (button) => {
    // Disable the button and show the spinner
    button.disabled = true
    button.spinner = true

    // Execute the button action and send the current step (if available)
    if (button.action) {
        await button.action(button, props.step)
    }

    // Enable the button and hide the spinner after the action is executed
    button.disabled = false
    button.spinner = false
}
</script>

<template>
    <div class="flex justify-between h-min">
        <template v-for="(button, index) in buttons" :key="index">
            <!-- Button -->
            <span
                v-if="!button.hide && typeButton(button)"
                class="relative"
                :class="{
                    'sn-addon-action h-min': true,
                    'border-t-2': true,
                    'opacity-50': disabled(button),
                    'text-gray-600/80': true,
                    'border-gray-400': disabled(button),
                    'border-primary-600': !button.classType && !disabled(button),
                    'border-sky-600': button.classType == 'sky' && !disabled(button),
                    'border-teal-600': button.classType == 'green' && !disabled(button),
                    'border-warning-600': button.classType == 'warning' && !disabled(button),
                    'border-pink-600': button.classType == 'red' && !disabled(button),
                    'border-red-600': button.classType == 'rose' && !disabled(button),
                }">

                <SpinnerStep
                    v-if="button.spinner"
                    :color='spinnerColor(button)'
                    class="absolute left-2 mt-1 inline-flex sm-badge-counter items-center justify-center w-6 h-6 text-xs
                    font-bold border-1 border-red rounded-full" />

                <div
                    :class="{
                        'p-1': true,
                        'flex': true,
                        'flex-col': true,
                        'action-button': true,
                        'mt-1': true,
                        'cursor-pointer': !disabled(button),
                        'mx-1': true,
                        'hover:text-primary-600': !button.classType && !disabled(button),
                        'hover:text-sky-600': button.classType == 'sky' && !disabled(button),
                        '!text-primary-500': button.classType == 'primary' && !disabled(button),
                        'hover:text-teal-600': button.classType == 'green' && !disabled(button),
                        'hover:text-warning-600': button.classType == 'warning' && !disabled(button),
                        'hover:text-pink-600': button.classType == 'red' && !disabled(button),
                        'hover:text-red-600': button.classType == 'rose' && !disabled(button)
                    }"
                    class="justify-center max-w-[35px]"
                    :onClick="() => !disabled(button) && click(button)" >
                    <!-- pulse Button -->
                    <div
                        :class="{
                            'pulse-primary rounded-full' : button.pulse && !disabled(button)
                        }"
                        class="flex justify-center items-center align-center text-align-center">
                        <svg-icon
                            type="mdi"
                            :path="button.icon"
                            size="24" />
                    </div>

                    <div class="flex justify-center align-center text-center text-xs pt-1 select-none">
                        {{ $t(button.label) }}
                    </div>
                </div>
            </span>

            <!-- Divider -->
            <span
                v-if="button.type == 'divider' && !button.hide"
                class="border-r border-1 sn-divider border-gray-300 mx-3">
                <button class="h-full" />
            </span>
        </template>
    </div>
</template>

<style scoped>
/* Hides the divider that immediately follows another divider */
.sn-divider:has(+ .sn-divider) {
    display: none !important;
}

/* Hides the last divider in a series */
.sn-divider:last-child {
    display: none;
}

/* Styles for spacing between elements in a horizontal layout */
.sn-space-x-8 > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 0;
    padding-right: calc(2rem * var(--tw-space-x-reverse));
    padding-left: calc(2rem * calc(1 - var(--tw-space-x-reverse)));
}

/* Styles for adjusting spacing between an addon action and a divider */
.sn-addon-action + .sn-divider {
    padding-left: calc(1.4rem) !important;
    margin-right: calc(2rem) !important;
}

/* Styles for adjusting spacing between a divider and an addon action */
.sn-divider + .sn-addon-action {
    padding-left: 0 !important;
}

/* Styles for adjusting spacing between adjacent dividers */
.sn-divider + .sn-divider {
    padding-left: calc(1.4rem) !important;
    margin-right: calc(2rem) !important;
}

/* Styles for an element with a pulse animation */
.pulse-primary {
    animation: animate-pulse 3s linear infinite;
    cursor: pointer;
}

/*
| @keyframes named animate-pulse  has 4 selectors: 0%, 40%,  80%, 100%.
| The number 20 in pixels determines the radius of the maximum size to which the 'pulse' shadow will grow.
| The defined color '#6366f1' corresponds to our primary color 'primary-500'.
*/
@keyframes animate-pulse{
    0%{
        box-shadow: 0 0 0 0 #6366f1,  0 0 0 0 #6366f1
    }

    40%{
        box-shadow: 0 0 0 20px rgba(255,109,74,0.0);
    }

    80%{
        box-shadow: 0 0 0 20px rgba(255,109,74,0.0);
    }

    100%{
        box-shadow: 0 0 0 20px rgba(255,109,74,0.0);
    }
}
</style>
