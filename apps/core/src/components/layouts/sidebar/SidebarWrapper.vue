<script setup>
import { ref, watch } from 'vue'
import ResizableSidebar from './ResizableSidebar.vue'

import {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot
} from '@headlessui/vue'

import { XMarkIcon } from '@heroicons/vue/24/outline'

defineEmits(['contentWidth', 'isSidebarOpen'])

const props = defineProps(['openSidebar', 'forceOpenDesktopSidebar', 'toggleSidebar'])

const isOpen = ref(false)

// For mobile menu
watch(() => props.openSidebar, async () => {
    isOpen.value = true
})
</script>

<template>
    <TransitionRoot as="template" :show="isOpen">
        <Dialog as="div" class="relative z-40 lg:hidden" @close="isOpen = false">
            <TransitionChild
                as="template"
                enter="transition-opacity ease-linear duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leave-from="opacity-100"
                leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </TransitionChild>

            <div class="fixed inset-0 !z-50 flex">
                <TransitionChild
                    as="template"
                    enter="transition ease-in-out duration-300 transform"
                    enter-from="-translate-x-full"
                    enter-to="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leave-from="translate-x-0"
                    leave-to="-translate-x-full">
                    <DialogPanel class="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                        <TransitionChild
                            as="template"
                            enter="ease-in-out duration-300"
                            enter-from="opacity-0"
                            enter-to="opacity-100"
                            leave="ease-in-out duration-300"
                            leave-from="opacity-100"
                            leave-to="opacity-0">
                            <div class="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    type="button"
                                    class="ml-1 flex h-10 w-10 items-center justify-center rounded-full
                                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    @click="isOpen = false">
                                    <span class="sr-only">Close sidebar</span>

                                    <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>
                        </TransitionChild>

                        <slot name="MenuMobile"></slot>
                    </DialogPanel>
                </TransitionChild>

                <div class="w-14 flex-shrink-0">
                    <!-- Force sidebar to shrink to fit close icon -->
                </div>
            </div>
        </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <ResizableSidebar
        :forceOpenDesktopSidebar="forceOpenDesktopSidebar"
        @content-width="(value) => $emit('contentWidth', value)"
        @isOpen="(value) => $emit('isSidebarOpen', value)">
        <slot name="MenuDesktop"></slot>
    </ResizableSidebar>
</template>
