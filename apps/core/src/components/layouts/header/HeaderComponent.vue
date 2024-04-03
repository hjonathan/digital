<script setup>
import { onMounted } from 'vue'
import HamburgerButton from './HamburgerButton.vue'
import Searcher from './Searcher.vue'
import ChangeLanguage from './ChangeLanguage.vue'
import Notifications from './Notifications.vue'
import Separator from './Separator.vue'
import UserDropdown from './UserDropdown.vue'
import Updater from './Updater.vue'

onMounted(() => {
    // Add shadow to header when scroll occurs
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header')

        if (header) header.classList.toggle('shadow', scrollY > 0)
    })
})

const emit = defineEmits(['openSidebar'])

// Event for mobile menu
const openSidebar = () => {
    emit('openSidebar')
}
</script>

<template>
    <header class="js-header sticky top-0 z-10 flex py-2 items-center border-b border-gray-200 bg-white gap-x-4 pl-4 pr-8 lg:pr-4">
        <!-- Menu toggle button for  mobile -->
        <HamburgerButton
            @click="openSidebar" />

        <!-- Line separator (for mobile) -->
        <Separator
            class="lg:hidden" />

        <!-- Searcher -->
        <Searcher />

        <!-- To change the language -->
        <ChangeLanguage />

        <!-- Notifications dropdown -->
        <Notifications />

        <Updater />

        <!-- Line separator (for desktop) -->
        <Separator
            class="hidden lg:block" />

        <!-- User dropdown -->
        <div class="block !z-50">
            <UserDropdown />
        </div>
    </header>
</template>
