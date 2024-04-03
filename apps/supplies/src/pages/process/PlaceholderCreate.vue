<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { Button } from 'layout'

const props = defineProps({
    label: {
        type: String,
        default: () => { 'NN' }
    },
    labelButton: {
        type: String,
        default: () => { 'NN' }
    },
    description: {
        type: String,
        default: () => { '' }
    },
    onClick: {
        type: Function,
        default: () => () => {}
    },
    icon: Object
})

</script>

<template>
    <div class="group flex flex-col justify-center items-center h-60 border-dashed border-4 w-full border-gray-300 space-y-5 rounded-lg">
        <div class="text-center">
            <span
                 v-if="icon"
                class="inline-flex h-12 w-12 items-center rounded-full border-1 justify-center bg-gray-300 text-white " >
                <svg-icon
                    type="mdi"
                    :path="icon"
                    size="32" />
            </span>

            <h3 class="mt-2 text-sm font-semibold text-gray-900">
                {{ label }}
            </h3>

            <p class="mt-1 text-sm text-gray-500">
                {{ description }}
            </p>

            <div class="mt-6">
                <Button
                    class="!px-0 opacity-90 hover:opacity-100"
                    :label="labelButton"
                    size="sm"
                    color="primary"
                    @click="onClick" />
            </div>
        </div>
    </div>
</template>
