<script setup>
/**
 * Flexible and customizable badge component.
 *
 * Props:
 *      type: Specifies the type of the badge (e.g., success, warning, danger, info).
 *      label: Text content displayed within the badge.
 *      backgroundColor: Custom background color for the entire badge.
 *      ringColor: Custom border color for the badge.
 *      textColor: Custom text color for the badge.
 *
 * Usage:
 *      Use the 'type' prop to specify the badge type (success, warning, danger, info).
 *      Customize appearance by providing optional 'backgroundColor', 'ringColor', or 'textColor'.
 *      Additional content within the badge can be included using the default slot.
 *
 * Example Usage:
*       <Badge
 *          type="success"
 *          label="Success"
 *          backgroundColor="bg-green-200"
 *          ringColor="ring-green-500"
 *          textColor="text-green-700">
 *          <!-- Additional content or custom label goes here -->
 *      </Badge>
 */

import { computed } from 'vue'

const props = defineProps({
    // Type of the badge (success, warning, danger, info)
    type: {
        type: String,
        default: 'success'
    },

    // Label text for the badge
    label: String,

    // Custom background color for the entire badge.
    backgroundColor: String,

    // Custom border color for the badge
    ringColor: String,

    // Custom text color for the badge
    textColor: String
})

// Default background colors for different badge types
const defaultBackgroundColors = {
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    danger: 'bg-red-50',
    info: 'bg-blue-50',
    orange: 'bg-orange-50'
}

// Default border colors for different badge types
const defaultRingColors = {
    success: 'ring-green-600/20',
    warning: 'ring-yellow-600/20',
    danger: 'ring-red-600/10',
    info: 'ring-blue-700/10',
    orange: 'ring-orange-700/10'
}

// Default text colors for different badge types
const defaulTextColors = {
    success: 'text-green-700',
    warning: 'text-yellow-800',
    danger: 'text-red-700',
    info: 'text-blue-800',
    orange: 'text-orange-800'
}

const computedClasses = computed(() => {
    // Base classes for styling the badge
    const baseClasses = ['flex items-center text-center text-nowrap rounded-md px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset']

    // Add custom background color if provided, otherwise use the default for the badge type
    if (props.backgroundColor) {
        baseClasses.push(props.backgroundColor)
    }

    if (!props.backgroundColor) {
        baseClasses.push(defaultBackgroundColors[props.type])
    }

    // Add custom ring color if provided, otherwise use the default for the badge type
    if (props.ringColor) {
        baseClasses.push(props.ringColor)
    }

    if (!props.ringColor) {
        baseClasses.push(defaultRingColors[props.type])
    }

    // Add custom text color if provided, otherwise use the default for the badge type
    if (props.textColor) {
        baseClasses.push(props.textColor)
    }

    if (!props.textColor) {
        baseClasses.push(defaulTextColors[props.type])
    }

    return baseClasses
})
</script>

<template>
    <span :class="computedClasses">
        {{ label }}

        <!-- Allow for additional content within the badge -->
        <slot />
    </span>
</template>
