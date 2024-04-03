<script setup>
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { inject } from 'vue'

const useStore = inject('useStore')

const layoutManagerStore = useStore('layoutManager')

const onClick = () => {
    layoutManagerStore.setVersionUpdater({
        card: true
    })
}
</script>

<template>
    <!-- Version updater -->
    <button
        v-if="layoutManagerStore.versionUpdater.button"
        type="button"
        @click="onClick"
        class="pulse px-1 !rounded-full w-8 h-8 text-red-600">
        <span class="sr-only"> {{ $t('Version update') }}</span>

        <ExclamationTriangleIcon class="h-6 w-6 text-red" aria-hidden="true" />
    </button>
</template>
