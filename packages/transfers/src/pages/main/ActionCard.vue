<script setup>
import { computed } from 'vue';
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
        type: String,
        default: '',
    },
    quantity: {
        type: Number,
        default: 0
    },
    action: {
        type: Function,
        default: () => ({})
    }
})

const accentColor  = computed(() => {
    if (props.color === 'danger') return 'red'
    if (props.color === 'success') return 'teal'
    if (props.color === 'info') return 'sky'
    if (props.color === 'warning') return 'yellow'

    return 'primary'
})
</script>

<template>
    <div
        @click="action()"
        class="flex shadows">
        <div :class="`bg-${accentColor}-500 flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-white`">
            <Component
                v-if="icon || icon"
                :type="isFunction(icon) ? null : 'mdi'"
                :is="isFunction(icon) ? icon : SvgIcon"
                :path="isFunction(icon) ? null : icon"
                :class="`w-8 h-8`" />
        </div>

        <div class="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
            <div class="flex-1 px-5 py-3">
                <p class="mt-0 font-medium truncate">{{ title }}</p>

                <p class="text-gray-500 mt-1 text-sm truncate">{{ subtitle }}</p>
            </div>

            <div
                v-if="quantity"
                :class="`justify-end mr-5 text-5xl text-${accentColor}-500`">
                    {{ quantity }}
            </div>
        </div>
    </div>
</template>
