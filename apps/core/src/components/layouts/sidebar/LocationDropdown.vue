<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline'

defineProps(['sidebarWidth'])

defineEmits(['openTab'])
</script>

<template>
    <div class="flex-shrink-0 border-t border-gray-200 p-4 select-none" v-show="sidebarWidth > 150">
        <label for="location" class="block text-sm font-medium leading-6 text-gray-700">
            {{ $t('Location') }}
        </label>

        <select
            id="location"
            name="location"
            class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-600 ring-1 ring-inset
            ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option selected>
                United States
            </option>

            <option>
                Canada
            </option>

            <option>
                Mexico
            </option>
        </select>
    </div>

    <div
        v-show="sidebarWidth < 150"
        class="flex justify-center p-2 border-t border-gray-200">
        <a
            :title="$t('Change location')"
            class="text-gray-400  cursor-pointer hover:text-primary-500">
            <MapPinIcon
                @click="$emit('openTab')"
                class="w-8" />
        </a>
    </div>
</template>
