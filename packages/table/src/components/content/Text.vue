<script setup>
import { getValue } from '../utils'

const props = defineProps({
    params: Object
})
</script>

<template>
    <a
        class="block flex pl-5 pr-7">
        <span>{{ props.params.formatter ? props.params.formatter(props.params.data): getValue(props.params) }}</span>
    </a>
</template>
