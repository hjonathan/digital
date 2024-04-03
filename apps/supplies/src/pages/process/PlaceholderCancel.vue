<script setup>
import { Button } from 'layout'
import { mdiBookmark } from '@mdi/js'
import { isFunction } from 'lodash'

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
    onClickTerminate: {
        type: Function,
        default: null
    }
})

</script>

<template>
    <div class="group flex flex-col justify-center items-center p-8 border-dashed border-4 w-full border-gray-300 space-y-5 rounded-lg">
        <div class="text-center">
            <h3 class="mt-2 text-sm font-semibold text-gray-900">
                {{ label }}
            </h3>

            <p class="mt-1 text-sm text-gray-500">
                {{ description }}
            </p>

            <span class="isolte inline-flex space-x-2 rounded-md shadow-sm air">
                <Button
                    v-if="isFunction(onClickTerminate)"
                    @click="onClickTerminate"
                    class="!px-2 opacity-90 hover:opacity-100"
                    type="button"
                    flat
                    size="sm"
                    :icon="mdiBookmark"
                    icon-class="text-yellow-500 !h-6 !w-6"
                    :label="labelButton"/>
            </span>
        </div>
    </div>
</template>
