<script setup>
import { getValue } from '../utils'

const props = defineProps({
    params: Object
})

/**
 * Returns the color by executing the function
 */
const color = () => {
    return props.params.color(props.params.data)
}

</script>

<template>
    <div :class="['h-full space-x-2 px-2 items-center flex']">
        <span :class="{'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset': true,
                'bg-gray-50 text-gray-600 ring-gray-500/10': color() == 'gray',
                'bg-red-50 text-red-600 ring-red-500/10': ['red','danger'].includes(color()),
                'bg-primary-50 text-primary-600 ring-primary-500/10': color() == 'primary',
                'bg-teal-50 text-teal-600 ring-teal-500/10': ['success','teal'].includes(color()),
                'bg-yellow-50 text-yellow-600 ring-yellow-500/10':['yellow','warning'].includes(color()),
                'bg-blue-50 text-blue-600 ring-blue-500/10': ['blue','info'].includes(color()),
                }"

            >{{ props.params.formatter ? props.params.formatter(props.params.data): getValue(props.params) }}
        </span>
    </div>
</template>
