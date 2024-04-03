<script setup>
import { Badge } from 'layout'
import { getColor } from '../pages/configColors'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
    status: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: ''
    }
})

const badgeSize = {
    xs: '!text-xs',
    sm: '!text-sm',
    lg: '!text-lg',
    xl: '!text-xl',
    '2xl': '!text-2xl',
    '3xl': '!text-3xl',
    '4xl': '!text-4xl',
    '5xl': '!text-5xl',
    '6xl': '!text-6xl',
    '7xl': '!text-7xl',
    '8xl': '!text-8xl',
    '9xl': '!text-9xl'
}
</script>

<template>
    <Badge
        :label="t(label)"
        :type="getColor(status)"
        :class="`${badgeSize[size]} text-xl`" />
</template>
