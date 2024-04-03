<script setup>
import { Title, Alert } from 'layout'

defineProps({
    title: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    saveMessage: {
        type: Object,
        default: null
    },
    errors: {
        type: Object,
        default: null
    }
})

</script>

<template>
    <!-- Title -->
    <Title :title="title" :has-padding="false">
        <template v-slot:rightTitle>
            {{ subtitle }}
        </template>
    </Title>

    <Alert
        v-if="errors?.isOpen"
        :content="errors?.message"
        :type="errors?.type"
        :has-close-button="false"
    />
</template>
