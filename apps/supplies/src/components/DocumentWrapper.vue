<script setup>
import { ActionButtons } from 'layout'
import { computed } from 'vue'

const props = defineProps({
    buttons: Array
})

const buttons = computed(() => {
    return props.buttons
})
</script>

<template>
    <div class="flex flex-col">
        <div class="flex sticky top-0 z-10 justify-center">
            <div class="max-w-8xl w-full flex justify-end mx-4 2xl:mx-auto bg-gray-100">
                <ActionButtons
                    :items="buttons" />
            </div>
        </div>

        <section class="w-full pt-0">
            <div class="max-w-8xl mx-auto">
                <slot />
            </div>
        </section>
    </div>
</template>
