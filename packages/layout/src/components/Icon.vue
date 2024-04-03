<script setup>
import { isFunction } from 'lodash'
import SvgIcon from '@jamescoyle/vue-icon'

defineProps({
    icon: {
        type: [String, Function],
        default: null
    },
    size: {
        type: String,
        default: 'md'
    },
    color: {
        type: String,
        default: ''
    }
})

const sizes = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24'
}

</script>

<template>
    <span>
        <Component
            v-if="icon || icon"
            :type="isFunction(icon) ? null : 'mdi'"
            :is="isFunction(icon) ? icon : SvgIcon"
            :path="isFunction(icon) ? null : icon"
            :class="`${sizes[size]} inline-flex`" />
    </span>
</template>
