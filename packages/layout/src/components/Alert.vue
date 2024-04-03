<script setup>
/*
|--------------------------------------------------------------------------
| Alert
|--------------------------------------------------------------------------
|
| Implements a flexible and customizable alert component that can be used to display various types of messages,
| such as success messages, warnings, errors, or informational messages. The component supports dynamic theming,
| custom icons, and provides the option to include a close or cancel button.
|
| Slots:
|   title`: Custom slot for the title, allowing for more complex title structures.
|   Default slot: Custom slot for additional or custom content within the alert.
|
| Emitted Events:
|  `update:modelValue`: Event emitted when the visibility state of the alert changes.
|  `clic-on-cancel`: Custom event emitted when the close button is clicked.
|
| Usage Example:
|   <Alert
|       v-model:modelValue="showAlert"
|       type="warning"
|       title="Warning!"
|       content="This is a warning message."
|       :hasCloseButton="true">
|       <!-- Additional content within the alert -->
|           <p>Additional details...</p>
|   </Alert>
*/
import { useSlots, computed } from 'vue'

import { Title } from 'layout'

import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon,
    XCircleIcon,
    InformationCircleIcon
} from '@heroicons/vue/20/solid'

const props = defineProps({
    // Boolean indicating whether the alert is visible or not
    modelValue: {
        type: Boolean,
        default: true
    },

    /*
    | Type of alert, determining its appearance. Default is 'success'.
    | Type of alerts: 'success', 'warning', 'danger', or 'info'
    */
    type: {
        type: String,
        default: 'success'
    },

    // Title text displayed at the top of the alert.
    title: String,

    // Custom color for the title text.
    titleColor: String,

    // Main content of the alert.
    content: String,

    // Custom content text color
    contentTextColor: String,

    // Custom icon component for the alert
    icon: Function,

    // Custom icon color
    iconColor: String,

    // Custom background color for the entire alert.
    backgroundColor: String,

    // Custom border color for the alert
    borderColor: String,

    // Custom border color for the alert
    borderRounded: {
        type: Boolean,
        default: true
    },

    // Custom color for the separator line beneath the title
    headerSeparatorColor: String,

    // Boolean indicating whether to show the close button or not
    hasCloseButton: {
        type: Boolean,
        default: true
    },

    // Boolean used when the alert is displayed in fixed position (in GlobalAlert)
    isFixed: {
        type: Boolean,
        default: false
    }
})

// Use the `useSlots` function to access slots
const slots = useSlots()

// Default icons for different alert types
const defaultIcons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    danger: XCircleIcon,
    info: InformationCircleIcon
}

// Default colors for different alert types
const defaultIconColors = {
    success: 'text-success-500',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    info: 'text-blue-400'
}

// Default background colors for different alert types
const defaultBackgroundColors = {
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50'
}

// Default border colors for different alert types
const defaultBorderColors = {
    success: 'border-green-400',
    warning: 'border-yellow-400',
    danger: 'border-red-500',
    info: 'border-blue-500'
}

// Default title colors for different alert types
const defaultTitleColors = {
    success: 'text-green-800',
    warning: 'text-yellow-800',
    danger: 'text-red-800',
    info: 'text-blue-800'
}

// Default content text color for different alert types
const defaulContentTextColor = {
    success: 'text-green-700',
    warning: 'text-yellow-700',
    danger: 'text-red-700',
    info: 'text-blue-700'
}

// Computed properties for dynamic rendering the icon
const computedIcon = computed(() => {
    let icon = defaultIcons[props.type]

    props.icon && (icon = props.icon)

    return icon
})

// Use custom icon color if provided, otherwise use the default for the alert type
const computedIconColor = computed(() => {
    let color = defaultIconColors[props.type]

    props.iconColor && (color = props.iconColor)

    return color
})

const computedClasses = computed(() => {
    // Base classes for styling the alert
    const baseClasses = [
        'border-l-4',
        'p-4',
        'relative',
        'flex', {
            'rounded-md': props.borderRounded
        }, {
            'shadow-xl': props.isFixed
        },
    ]

    // Add custom background color if provided, otherwise use the default for the alert type
    if (props.backgroundColor) {
        baseClasses.push(props.backgroundColor)
    }

    if (!props.backgroundColor) {
        baseClasses.push(defaultBackgroundColors[props.type])
    }

    // Add custom border color if provided, otherwise use the default for the alert type
    if (props.borderColor) {
        baseClasses.push(props.borderColor)
    }

    if (!props.borderColor) {
        baseClasses.push(defaultBorderColors[props.type])
    }

    return baseClasses
})

// Use custom title color if provided, otherwise use the default for the alert type
const computedTitleColor = computed(() => {
    let color = defaultTitleColors[props.type]

    props.titleColor && (color = props.titleColor)

    return color
})

// Use custom content text color if provided, otherwise use the default for the alert type
const computedTextColor = computed(() => {
    let color = defaulContentTextColor[props.type]

    props.contentTextColor && (color = props.contentTextColor)

    return color
})

// Base classes for styling the close button
const computedCloseButtonClasses = computed(() => {
    const baseClasses = [
        'inline-flex',
        'rounded-md',
        'p-1.5',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
    ]

    // Add specific styles for each alert type
    if (props.type === 'success') {
        baseClasses.push('bg-green-50', 'text-green-500', 'hover:bg-green-100', 'focus:ring-green-600', 'focus:ring-offset-green-50')
    }

    if (props.type === 'warning') {
        baseClasses.push('bg-yellow-50', 'text-yellow-500', 'hover:bg-yellow-200', 'focus:ring-yellow-400', 'focus:ring-offset-yellow-50')
    }

    if (props.type === 'danger') {
        baseClasses.push('bg-red-50', 'text-red-500', 'hover:bg-red-200', 'focus:ring-red-400', 'focus:ring-offset-red-50')
    }

    if (props.type === 'info') {
        baseClasses.push('bg-blue-50', 'text-blue-500', 'hover:bg-blue-200', 'focus:ring-blue-400', 'focus:ring-offset-blue-50')
    }

    return baseClasses
})

// Emitting events
const emit = defineEmits(['update:modelValue', 'clic-on-cancel'])

const computedShow = computed({
    get: () => props.modelValue,
    set: nValue => { emit('update:modelValue', nValue) }
})

// Hide the alert and emit a custom cancel event
const cancel = () => {
    computedShow.value = false

    emit('clic-on-cancel')
}
</script>

<template>
    <!-- The alert component -->
    <Transition>
        <div
            v-if="computedShow"
            :class="computedClasses">
            <!-- Icon -->
            <div class="flex-shrink-0">
                <!-- Render the icon using the computed component and color -->
                <component
                    :is="computedIcon"
                    :class="computedIconColor"
                    class="h-5 w-5" />
            </div>

            <!-- Content -->
            <div class="ml-3 w-full">
                <!-- Heading section -->
                <Title
                    v-if="title || slots.title"
                    :has-margin="false"
                    :has-padding="false"
                    :titleClasses="computedTitleColor"
                    :has-border-bottom-line="false"
                    title-type="h6">
                    <span v-if="title">
                        {{ $t(title) }}
                    </span>

                    <!-- Custom title slot -->
                    <slot
                        name="title" />
                </Title>

                <!-- Main content section -->
                <div
                    :class="[computedTextColor ,{ 'mt-2' : title ||  slots.title }]"
                    class="text-sm ">
                    <p
                        class="!m-0 pr-8">
                        <!-- Render the content received by the 'content' prop -->
                        {{ content }}

                        <!-- Custom slot content -->
                        <slot />
                    </p>
                </div>
            </div>

            <!-- Close button -->
            <div
                v-if="hasCloseButton"
                class="absolute top-2.5 right-1 ml-auto">
                <!-- Close button with click event handling -->
                <button
                    @click="cancel()"
                    type="button"
                    :class="[computedCloseButtonClasses]">
                    <span
                        class="sr-only">
                        {{ $t('Dismiss') }}
                    </span>

                    <!-- XMarkIcon for the close button -->
                    <XMarkIcon
                        class="h-5 w-5" />
                </button>
            </div>
        </div>
    </Transition>
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
