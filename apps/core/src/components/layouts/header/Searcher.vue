<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
</script>

<template>
    <form class="relative flex flex-1">
        <label
            for="search-field"
            class="sr-only">
            {{ $t('Search') }}
        </label>

        <MagnifyingGlassIcon
            class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
            aria-hidden="true" />

        <input
            id="search-field"
            class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-700 placeholder:text-gray-400 focus:ring-0"
            :placeholder="$t('Search...')"
            type="search"
            name="search" />
    </form>
</template>
