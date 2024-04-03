<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiChevronUp } from '@mdi/js'
import { defineModel } from 'shared'

defineProps({
    down: Boolean
})

const downModel = defineModel('down')
</script>

<template>
    <svg-icon
        type="mdi"
        :class="{'!rotate-180 ' : !downModel}"
        class="border-[2px] border-gray-300 hover:bg-gray-300 bg-gray-200 rounded-full cursor-pointer transition-all duration-300"
        @click.stop.prevent="downModel = !downModel"
        aria-hidden="true"
        :path="mdiChevronUp"/>
</template>
