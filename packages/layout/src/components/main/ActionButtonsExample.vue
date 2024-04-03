<script setup>
import { computed } from 'vue'
import ActionButtons from '../ActionButtons.vue'
import { Title } from 'layout'

import {
    mdiInboxArrowDown
} from '@mdi/js'

const items = computed(() => {
    return [{
        icon: mdiInboxArrowDown,
        label: 'Receive product title',
        type: 'button',
        spinner: true,
        disabled: true,
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'sky',
        counter: 10,
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'sky',
        spinner: true,
        disabled: true,
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'yellow',
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'yellow',
        disabled: true,
        counter: 3,
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'teal',
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'teal',
        disabled: true,
        counter: 3,
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'sky',
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'sky',
        disabled: true,
        counter: 3,
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'red',
        counter: 3,
        action: (data) => {}
    },
    {
        icon: mdiInboxArrowDown,
        label: 'Receive',
        type: 'button',
        classType: 'red',
        disabled: true,
        action: (data) => {}
    }]
})
</script>

<template>
    <Title>
        {{ $t('Action buttons Example') }}
    </Title>

    <div class="mt-8">
        <ActionButtons :items="items"/>
    </div>
</template>
