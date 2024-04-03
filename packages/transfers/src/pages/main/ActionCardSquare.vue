<script setup>
import { Card, Title } from 'layout'
import { computed } from 'vue'
import { isFunction } from 'lodash'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    icon: {
        type: [Function, String],
        default: () => ({})
    },
    subtitle: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: 'primary'
    },
    quantity: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: false
    },
    action: {
        type: Function,
        default: () => ({})
    }
})

// Css for active card
const activeClasses = {
    primary: {
        container: '!bg-primary-500',
        iconContainer: '!bg-white',
        icon: '!text-primary-500',
        text: '!text-white'
    },
    info: {
        container: '!bg-sky-500',
        iconContainer: '!bg-white',
        icon: '!text-sky-500',
        text: '!text-white'
    },
    success: {
        container: '!bg-teal-500',
        iconContainer: '!bg-white',
        icon: '!text-teal-500',
        text: '!text-white'
    },
    warning: {
        container: '!bg-yellow-500',
        iconContainer: '!bg-white',
        icon: '!text-yellow-500',
        text: '!text-white'
    },
    danger: {
        container: '!bg-red-500',
        iconContainer: '!bg-white',
        icon: '!text-red-500',
        text: '!text-white'
    },
    // Extra colors
    orange: {
        container: '!bg-orange-500',
        iconContainer: '!bg-white',
        icon: '!text-orange-500',
        text: '!text-white'
    }
}

// Css for hover card
const hoverClasses = {
    primary: {
        container: 'hover:bg-primary-500',
        iconContainer: 'bg-primary-500',
        icon: 'group-hover:text-primary-500',
        text: 'text-primary-500'
    },
    info: {
        container: 'hover:bg-sky-500',
        iconContainer: 'bg-sky-500',
        icon: 'group-hover:text-sky-500',
        text: 'text-sky-500'
    },
    success: {
        container: 'hover:bg-teal-500',
        iconContainer: 'bg-teal-500',
        icon: 'group-hover:text-teal-500',
        text: 'text-teal-500'
    },
    warning: {
        container: 'hover:bg-yellow-500',
        iconContainer: 'bg-yellow-500',
        icon: 'group-hover:text-yellow-500',
        text: 'text-yellow-500'
    },
    danger: {
        container: 'hover:bg-red-500',
        iconContainer: 'bg-red-500',
        icon: 'group-hover:text-red-500',
        text: 'text-red-500'
    },
    // Extra colors
    orange: {
        container: 'hover:bg-orange-500',
        iconContainer: 'bg-orange-500',
        icon: 'group-hover:text-orange-500',
        text: 'text-orange-500'
    }
}

// Gets css classes for card
const allCardClasses = computed(() => {
    if (!props.color) return {}

    return props.active ? activeClasses[props.color] : hoverClasses[props.color]
})
</script>

<template>
    <!-- Main content -->
    <div class="w-full h-full">
        <Card
            :placeContentCenter="false"
            isLink
            flat
            :class="`!shadow-none bg-white relative transition-all !h-full cursor-pointer hover:text-white ${allCardClasses.container}`"
            @click="action()">
            <div class="flex flex-col justify-center items-center w-full gap-1">
                <!-- Quantity -->
                <div
                    v-if="quantity"
                    :class="`text-5xl font-bold group-hover:text-white ${allCardClasses.text}`">
                    {{ quantity }}
                </div>

                <!-- Icon -->
                <span
                    v-if="!quantity && icon"
                    :class="`col-span-1 flex justify-center p-2 rounded-lg transition-all group-hover:bg-white
                        ${allCardClasses.iconContainer}`">
                   <Component
                        v-if="icon || icon"
                        :type="isFunction(icon) ? null : 'mdi'"
                        :is="isFunction(icon) ? icon : SvgIcon"
                        :path="isFunction(icon) ? null : icon"
                        :class="`w-8 h-8 text-white ${allCardClasses.icon} transition-all`" />
                </span>

                <!-- Title and subtitle -->
                <div :class="`flex flex-col w-full items-center  group-hover:text-white ${allCardClasses.text}`">
                    <Title
                        :hasBorderBottomLine="false"
                        :has-padding="false"
                        titleType="h4"
                        title-classes="text-center"
                        inSlideOver>
                        {{ title }}
                    </Title>

                    <div :class="`text-xs font-light text-center group-hover:text-white ${active ? 'text-white' : 'text-gray-500'}`">
                        {{ subtitle }}
                    </div>
                </div>
            </div>
        </Card>
    </div>
</template>
