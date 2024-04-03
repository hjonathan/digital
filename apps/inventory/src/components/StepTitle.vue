<script setup>
import { Title } from 'layout'
import { showUuid } from 'shared'
import { computed } from 'vue'

const props = defineProps({
    step: {
        type: Object,
        default: () => ({})
    },
    ids: {
        type: Array,
        default: () => ([])
    }
})

const formatedIds = computed(() => {
    return props.ids.map(id => showUuid(id)).join(', ')
})

</script>

<template>
    <div class="flex flex-row justify-between">
        <Title
            v-if="step.subtitle && step.items?.length"
            title-type="h2"
            :hasBorderBottomLine="false"
            :title="step.subtitle" />

        <Title
            v-if="step.subtitle && step.items?.length"
            title-type="h2"
            :hasBorderBottomLine="false"
            :title="formatedIds" />
    </div>
</template>
