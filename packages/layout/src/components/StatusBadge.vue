<script setup>
import { Badge } from 'layout'

const props = defineProps({
    status: String,
    type: String,
    label: String,
    description: String
})

</script>

<template>
    <Badge
        :type="type || 'secondary'"
        :label="label || ' '"
        class="!text-sm" />

    <span v-if= "description" class="text-sm text-gray-500">
        {{ description }}
    </span>
</template>
