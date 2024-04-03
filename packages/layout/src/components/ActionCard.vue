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
        type: [String, Function],
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    color: {
        type: Object,
        default: () => ({ default: 'primary', hover: 'white' })
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

const allCardClasses = computed(() => {
    let defaultClasses = {
        container: 'hover:bg-primary-500 hover:text-white',
        iconContainer: 'bg-primary-500 group-hover:bg-white',
        icon: 'text-white group-hover:text-primary-500',
        text: 'text-primary-500 group-hover:text-white'
    }

    if (props.color === 'success') {
        defaultClasses = {
            container: 'hover:bg-teal-500 hover:text-white',
            iconContainer: 'bg-teal-500 group-hover:bg-white',
            icon: 'text-white group-hover:text-teal-500',
            text: 'text-teal-500 group-hover:text-white'
        }
    }

    if (props.color === 'danger') {
        defaultClasses = {
            container: 'hover:bg-red-500 hover:text-white',
            iconContainer: 'bg-red-500 group-hover:bg-white',
            icon: 'text-white group-hover:text-red-500',
            text: 'text-red-500 group-hover:text-white'
        }
    }

    if (props.color === 'info') {
        defaultClasses = {
            container: 'hover:bg-sky-500 hover:text-white',
            iconContainer: 'bg-sky-500 group-hover:bg-white',
            icon: 'text-white group-hover:text-sky-500',
            text: 'text-sky-500 group-hover:text-white'
        }
    }

    if (props.color === 'warning') {
        defaultClasses = {
            container: 'hover:bg-yellow-500 hover:text-white',
            iconContainer: 'bg-yellow-500 group-hover:bg-white',
            icon: 'text-white group-hover:text-yellow-500',
            text: 'text-yellow-500 group-hover:text-white'
        }
    }

    return defaultClasses
})
</script>

<template>
    <Card
        :placeContentCenter="false"
        isLink
        :class="`relative transition-all cursor-pointer ${allCardClasses.container}`"
        @click="action()">
        <div class="grid grid-cols-6 justify-center items-center w-full space-x-10">
            <!-- Icon container -->
            <span
                :class="`col-span-1 flex justify-center p-2 rounded-lg transition-all ${allCardClasses.iconContainer}`">
                <Component
                    v-if="icon || icon"
                    :type="isFunction(icon) ? null : 'mdi'"
                    :is="isFunction(icon) ? icon : SvgIcon"
                    :path="isFunction(icon) ? null : icon"
                    :class="`w-8 h-8 text-white ${allCardClasses.icon} transition-all`" />
            </span>

            <!-- Title and subtitle -->
            <div class="col-span-4">
                <Title
                    :hasBorderBottomLine="false"
                    titleType="h4"
                    inSlideOver>
                    {{ title }}
                </Title>

                <span class="text-xs font-light text-right whitespace-nowrap">
                    {{ subtitle }}
                </span>
            </div>

            <div
                v-if="quantity"
                class="col-span-1 justify-end">
                <span :class="`text-5xl ${allCardClasses.text}`">{{ quantity }}</span>
            </div>
        </div>
    </Card>
</template>
