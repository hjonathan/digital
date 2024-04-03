<script setup>
import SummaryItem from './SummaryItem.vue'

defineProps({
    data: Object
})
</script>

<template>
    <div class="relative overflow-hidden pt-8 grid grid-cols-12 gap-8">
        <!-- Safety -->
        <SummaryItem
            class="bg-success-100 text-success-500"
            :value="`Pass`"
            :label="$t('Satefy')" />

        <!-- Total THC -->
        <SummaryItem
            :value="`${16.27600} %`"
            :label="$t('Total THC')" />

        <!-- Total CBD -->
        <SummaryItem
            :value="`ND`"
            :label="$t('Total CBD')" />

        <!-- Moisture -->
        <SummaryItem
            :value="`NT %`"
            :label="$t('Moisture')" />
    </div>
</template>
