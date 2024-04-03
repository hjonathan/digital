<script setup>
/*
|--------------------------------------------------------------------------
| Button Icon
|--------------------------------------------------------------------------
|
| Includes an 'action', object with the data required for the button.
| Includes a 'disabled' to enable or disable the entire wrapper
| Includes an 'active' To config color and text
| Includes a 'size' To config size for icon and text
|
*/

import { computed } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
    action: {
        type: Object,
        default: () => ({ name: '', icon: null, color: 'gray' })
    },
    disabled: Boolean,
    tooltip: {
        type: Boolean,
        default: false
    },
    active: {
        type: Object,
        default: () => ({ isActive: false, icon: null, color: 'primary' })
    },
    size: {
        type: String,
        default: 'md'
    }
})

const emit = defineEmits(['select'])

// TODO improve the logic of the isDisabled property
const isDisabled = computed(() => {
    if (props.action.name === 'Unlock') return false

    if (props.disabled || props.action.disabled) return true

    return false
})

const sizeButton = {
    iconContainer: {
        md: 'w-16',
        sm: 'w-14',
        xs: 'w-12'
    },
    icon: {
        md: 24,
        sm: 20,
        xs: 15
    },
    text: {
        md: 'px-4 py-1 text-[10px]',
        sm: 'px-2 py-1 text-[8px]',
        xs: 'px-2 py-1 text-[6px]'
    }
}

const classButton = computed(() => {
    const finalClass = {
        flex: true,
        'flex-col': true,
        [sizeButton.iconContainer[props.size]]: true,
        'p-3': true
    }

    finalClass['cursor-pointer'] = !props.disabled

    finalClass['text-gray-500/60 cursor-not-allowed'] = props.disabled

    finalClass[`text-${props?.action?.color}`] = !props?.active?.isActive && props?.action?.color

    finalClass[`hover:text-${props?.active?.color}`] = !props.disabled && props?.active?.color

    finalClass[`text-${props?.active?.color}`] = props?.active?.isActive

    return finalClass
})

const classText = computed(() => {
    const finalClass = {
        flex: true,
        'justify-center': true,
        'align-center': true,
        'text-center': true,
        'text-gray-700': true,
        'pt-2': true,
        [sizeButton.text[props.size]]: true
    }

    finalClass['text-gray-500/60 cursor-not-allowed'] = props.disabled

    finalClass[`hover:text-${props?.active?.color}`] = !props.disabled && props?.active?.color

    finalClass[`text-${props?.active?.color}`] = props?.active?.isActive

    return finalClass
})
</script>

<template>
    <div
        :class="classButton"
        class="justify-center border-t-2 border-gray-400"
        :onClick="disabled ? () => {} : () => emit('select')" >
        <div class="flex justify-center align-center text-align-center">
            <svg-icon type="mdi" :path="active.isActive ? active.icon : action.icon" :size="sizeButton.icon[size]" />
        </div>

        <div :class="classText">
            {{ $t(action.name) }}
        </div>
    </div>
</template>
