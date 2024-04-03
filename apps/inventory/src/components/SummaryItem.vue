<script setup>
defineProps({
    title: String,
    quantity: [String, Number],
    leftQuantityComplement: String,
    rightQuantityComplement: String,
    isBold: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <li class="!border-none">
        <div
            :class="{ 'font-semibold' : isBold }"
            class="flex justify-between">
            <span>
                {{ $t(title) }}
            </span>

            <span
                v-if="leftQuantityComplement">
                {{ leftQuantityComplement }}
            </span>

            {{ quantity }}

            <span
                v-if="rightQuantityComplement">
                {{ rightQuantityComplement }}
            </span>
        </div>
    </li>
</template>
