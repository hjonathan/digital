<script setup>
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
    label: {
        type: String,
        default: () => { 'NN' }
    },
    icon: Object
})

</script>

<template>
    <div class="group flex flex-col justify-center items-center h-60 border-dashed border-4 w-full border-gray-300 space-y-5 rounded-lg">
        <span v-if="icon"
            class="inline-flex h-24 w-24 items-center rounded-full border-1 justify-center bg-gray-300 text-white">
            <svg-icon
                type="mdi"
                :path="icon"
                size="70" />
        </span>

        <span class="text-gray-300 font-medium text-xl group-hover:text-gray-400/50">
            {{ label }}
        </span>
    </div>
</template>
