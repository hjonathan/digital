<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
    description: {
        type: String,
        default: ''
    }
})

const defaultDecription = ref('No items found')
</script>

<template>
    <div class="flex flex-col items-center justify-center bg-white p-4">
        <span>
            {{ description || t(defaultDecription) }}
        </span>
    </div>
</template>
