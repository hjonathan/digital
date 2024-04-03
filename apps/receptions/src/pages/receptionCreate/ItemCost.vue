<script setup>
defineProps({
    title: String,
    value: String,

    /* Sets the value property to bold  */
    valueBold: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div class="flex items-center justify-between py-2">
        <dt class="text-gray-700 font-semibold">
            {{ title }}
        </dt>

        <dd class="text-gray-900" :class="{'font-medium' : valueBold}">
            <slot name="value"></slot>

            {{ value }}
        </dd>
    </div>
</template>
