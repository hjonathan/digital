<script setup>
import { LanguageIcon } from '@heroicons/vue/24/outline'
</script>

<template>
    <button
        type="button"
        class="ml-3 p-2 rounded-full text-gray-400 hover:text-primary-500">
        <span class="sr-only">
            Change Language
        </span>

        <LanguageIcon
            class="h-6 w-6"
            aria-hidden="true" />
    </button>
</template>
