<script setup>
import { BellIcon } from '@heroicons/vue/24/outline'
</script>

<template>
    <!-- Notifications dropdown -->
    <button
        type="button"
        class="-m-2.5 p-2 text-gray-400 hover:text-primary-500 rounded-full">
        <span class="sr-only">
            {{ $t('View notifications') }}
        </span>

        <BellIcon
            class="h-6 w-6"
            aria-hidden="true" />
    </button>
</template>
