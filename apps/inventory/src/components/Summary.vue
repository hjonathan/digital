<script setup>
import { Title, DivideYWithText } from 'layout'
import SummaryItem from './SummaryItem.vue'

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    elements: {
        type: Array,
        default: () => ([])
    }
})
</script>

<template>
    <section class="bg-gray-200/80 p-8">
        <!-- Top section -->
        <Title
            v-if="title"
            :hasPadding="false"
            :title="title"
            titleType="h3"
            :has-border-bottom-line="false"
            class="!mt-0" />

        <Title
            v-if="subtitle"
            :hasPadding="false"
            :title="subtitle"
            titleType="h4"
            :has-border-bottom-line="false"
            class="!mt-3" />

        <!-- Dividing line -->
        <DivideYWithText
            backgroundColor="white"
            lineColor="border-t-2 border-t-gray-400"
            class="mt-3" />

        <div>
            <ul class="text-base text-gray-500 space-y-4">
                <!-- data summary -->
                <SummaryItem
                    v-for="(element, index) of elements"
                    :key="index"
                    :title="element.title"
                    :quantity="element.quantity"
                    :isBold="element.isBold"
                    :class="element.containerClass"/>
            </ul>

            <!-- Show errors -->
            <slot
                v-if="$slots['error']"
                name="error" >
            </slot>
        </div>

        <!-- Bottom section -->
        <div class="w-full" v-if="$slots['bottom-section']">
            <slot name="bottom-section"></slot>
        </div>
    </section>
</template>
