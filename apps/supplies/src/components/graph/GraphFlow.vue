<script setup>
import { VueFlow } from '@vue-flow/core'
import { defineModel } from 'shared'

defineProps({
    flow: {
        type: Array,
        default: () => ([])
    },
    nodeTypes: {
        type: Object,
        default: () => ({})
    }
})

const flowModel = defineModel('flow')

</script>

<template>
    <div class="flex w-full h-24">
        <VueFlow
            class="pointer-events-none !w-full"
            v-model="flowModel"
            :nodes-draggable="false"
            :select-nodes-on-drag="false"
            :zoom-on-double-click="false"
            :zoom-on-scroll="false"
            :pan-on-drag="false"
            :pan-on-scroll="false"
            pan-on-scroll-mode="horizontal"
            :node-types="nodeTypes" >
        </VueFlow>
    </div>
</template>

<style>
/* import the necessary styles for Vue Flow to work */
@import '@vue-flow/core/dist/style.css';

/* import the default theme, this is optional but generally recommended */
@import '@vue-flow/core/dist/theme-default.css';
</style>
