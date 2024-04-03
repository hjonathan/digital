<script setup>
import { computed } from 'vue'
import Spinner from './Spinner.vue'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
    label: {
        type: String,
        default: ''
    },

    // Color of the button that must be within the defined color palette.
    color: {
        type: String,
        default: ''
    },
    icon: {
        type: [String, Function],
        default: ''
    },
    iconRight: {
        type: String,
        default: ''
    },
    iconClass: {
        type: String,
        default: ''
    },

    // Button size that must be within the options xs, sm, md, lg, xl
    size: {
        type: String,
        default: 'md'
    },
    rounded: {
        type: Boolean,
        default: false
    },
    link: {
        type: Boolean,
        default: false
    },
    flat: {
        type: Boolean,
        default: false
    },
    outline: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

// Available sizes for buttons
const sizesAvailable = ['xs', 'sm', 'md', 'lg', 'xl']

// Defines the events available for the button.
const emits = defineEmits(['click'])

// List of available button sizes
const sizes = {
    xs: 'px-1 py-1 text-xs',
    sm: 'px-1 py-1 text-sm',
    md: '',
    lg: 'px-2 py-1 text-lg',
    xl: 'px-2 py-1 text-xl'
}

// List of available icon sizes
const buttonSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
}

// Processes and obtains the classes determined by the properties
const getButtonClass = computed(() => {
    const allClasses = [
        'button',
        'group',
        'relative',
        'justify-center',
        props.color,
        {
            link: props.link,
            flat: props.flat || props.link,
            outline: props.outline
        },
    ]

    if (props.loading || props.disabled) {
        allClasses.push('!cursor-not-allowed')
    }

    allClasses.push(sizesAvailable.includes(props.size) ? sizes[props.size] : sizes.md)

    props.rounded && allClasses.push('circular')

    return allClasses
})

// Emit event click for button
const clickEvent = (e) => {
    !props.loading && !props.disabled && emits('click', e)
}

// Gets icon size based on button size
const getIconClass = computed(() => {
    const allClasses = []

    allClasses.push(sizesAvailable.includes(props.size) ? buttonSizes[props.size] : buttonSizes.md)

    !props.loading && !props.disabled && props.iconClass && allClasses.push(props.iconClass)

    return allClasses
})
</script>

<template>
    <button class="group" :disabled="disabled || loading" :class="getButtonClass" @click="clickEvent">
        <!-- Left icon -->
        <slot v-if="$slots.icon || icon" name="icon">
            <svg-icon :path="icon" :class="getIconClass" type="mdi" />
        </slot>

        <!-- Label button -->
        <slot v-if="($slots.label || label)" name="label">
            <div :class="{ 'mx-3 whitespace-nowrap': true, 'opacity-0': ($slots.loading || loading) }">
                {{ label }}
            </div>
        </slot>

        <!-- Loading -->
        <slot v-if="$slots.loading || loading" name="loading">
            <Spinner class="absolute top-0 left-1 w-full h-full flex justify-center items-center" />
        </slot>

        <!-- Right icon -->
        <slot v-if="$slots.iconRight || iconRight" name="iconRight">
            <svg-icon :path="iconRight" :class="getIconClass" type="mdi" />
        </slot>
    </button>
</template>
