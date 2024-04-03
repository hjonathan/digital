<script setup>
defineProps({
    label: String,
    value: String
})
</script>

<template>
    <div class="col-span-12 sm:col-span-6 lg:col-span-3 border p-2 rounded-lg">
        <span class="text-success-500 text-center block text-4xl tracking-widest ">
            {{ value }}
        </span>

        <p class="text-center text-gray-400">
            {{ label }}
        </p>
    </div>
</template>
