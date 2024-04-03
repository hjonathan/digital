<script setup>
import { getValue } from '../utils'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
    params: Object
})

const action = props.params?.action

const onClick = () => {
    action(props.params.data)
}

/**
 * Returns the color by executing the function
 */
const color = () => {
    return props.params.color(props.params.data)
}

/**
 * Returns the icon by executing the function
 */
const icon = () => {
    return props.params.icon(props.params.data)
}
</script>

<template>
    <component :is=" color() === 'primary'? 'a' : 'span'"
        href="#"
        @click="onClick"
        :class="['h-full space-x-2 px-2 items-center flex',
            {
                'text-red-600': color() == 'red',
                'text-primary-600': color() == 'primary',
                'text-gray-600': color() == 'gray',
                'text-yellow-600':color() == 'yellow',
                'text-teal-600':color() == 'teal',
            }]">
        <SvgIcon v-if="icon()" type="mdi" :path='icon()' size="15"/>

        <span>{{ props.params.formatter ? props.params.formatter(props.params.data): getValue(props.params) }}</span>
    </component>
</template>
