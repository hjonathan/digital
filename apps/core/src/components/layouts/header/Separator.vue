<script setup>
defineProps({
    color: {
        type: String,
        default: 'bg-gray-900/10'
    }
})
</script>

<template>
    <div
        class="h-6 w-px"
        :class="[color]"
        aria-hidden="true" />
</template>
