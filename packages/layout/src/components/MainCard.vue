<script setup>
import { Card, Title } from 'layout'
defineProps({
    icon: [String, Function],
    title: String,
    subtitle: String,
    hasRing: {
        type: Boolean,
        default: false
    },
    action: {
        type: Function,
        default: () => ({})
    }
})
</script>

<template>
    <!-- Main cards -->
    <Card
        is-link
        @click="action()"
        :class="{ 'p-8': true, 'ring-2 ring-primary-200 hover:ring:3 hover:ring-primary-500 duration-300':2 }">

        <!-- Icon -->
        <component
            :is="icon"
            class="w-12 mx-auto mb-4 text-gray-600 group-hover:text-primary-500 group-hover:scale-110
            transition-all duration-300"
            aria-hidden="true" />

        <!-- Extra message -->
        <span class="text-xs font-light group-hover:text-primary-500 group-hover:scale-110 text-center
            transition-all duration-300">
            {{ $t(subtitle) }}
        </span>

        <!-- Title -->
        <div class="flex justify-center">
            <Title
                :has-border-bottom-line="false"
                title-type="h4"
                in-slide-over
                class="font-semibold text-gray-600 group-hover:text-primary-500 group-hover:scale-110 text-center
                transition-all duration-300">
                {{ $t(title) }}
            </Title>
        </div>
    </Card>
</template>
