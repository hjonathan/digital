<script setup>
import { getValue } from '../utils'

const props = defineProps({
    params: Object
})
</script>

<template>
    <a
        @click="props.params.action(props.params.data)"
        class="bg-primary-50 hover:bg-primary-100 text-primary-600 flex justify-between items-center h-full cursor-pointer pr-4 pl-5">
        <span>{{ props.params.formatter ? props.params.formatter(props.params.data): getValue(props.params) }}</span>
    </a>
</template>
