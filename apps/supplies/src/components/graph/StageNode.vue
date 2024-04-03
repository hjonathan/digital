<script setup>
import { Handle, Position } from '@vue-flow/core'
import { Icon } from 'layout'

defineProps({
    data: {
        type: Object,
        default: () => ({})
    }
})
</script>

<template>
   <div
        @click="data.action"
        :class="`flex flex-col items-center ${data.customClass} w-36 justify-center items-center border-2 rounded-lg hover:border-primary-500`">
        <div
            v-if="data.icon"
            class="bg-white rounded-full m-2">
            <Icon :icon="data.icon" />
        </div>

        <span class="text-center">{{ data.label }}</span>
   </div>

   <Handle
        v-if="data.type.includes('source') && data.handlers.includes('source_left')"
        id="source_left"
        type="source"
        :position="Position.Left"
        :style="{ backgroundColor: '#009688' }" />

   <Handle
        v-if="data.type.includes('source') && data.handlers.includes('source_top')"
        id="source_top"
        type="source"
        :position="Position.Top"
        :style="{ backgroundColor: '#009688' }" />

   <Handle
        v-if="data.type.includes('source') && data.handlers.includes('source_right')"
        id="source_right"
        type="source"
        :position="Position.Right"
        :style="{ backgroundColor: '#009688' }" />

    <Handle
        v-if="data.type.includes('source') && data.handlers.includes('source_bottom')"
        id="source_bottom"
        type="source"
        :position="Position.Bottom"
        :style="{ backgroundColor: '#009688' }" />

    <Handle
        v-if="data.type.includes('target') && data.handlers.includes('target_left')"
        id="target_left"
        type="target"
        :position="Position.Left"
        :style="{ backgroundColor: '#1976D2' }"/>

    <Handle
        v-if="data.type.includes('target') && data.handlers.includes('target_top')"
        id="target_top"
        type="target"
        :position="Position.Top"
        :style="{ backgroundColor: '#1976D2' }"/>

   <Handle
        v-if="data.type.includes('target') && data.handlers.includes('target_right')"
        id="target_right"
        type="target"
        :position="Position.Right"
        :style="{ backgroundColor: '#1976D2' }"/>

    <Handle
        v-if="data.type.includes('target') && data.handlers.includes('target_bottom')"
        id="target_bottom"
        type="target"
        :position="Position.Bottom"
        :style="{ backgroundColor: '#1976D2' }"/>
</template>
