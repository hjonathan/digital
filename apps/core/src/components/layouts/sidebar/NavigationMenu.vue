<script setup>
import { inject, ref } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'
import NavigationItem from './NavigationItem.vue'

const props = defineProps(['navigationLinks', 'sidebarWidth', 'isSidebarOpen'])

const route = useRoute()

const useStore = inject('useStore')
const tabsStore = useStore('tabs')

const data = ref(props.navigationLinks)
const defaultSidebarWith = 150
/**
 * Extend the link menu and open tab
 * @param {*} link
 */
const extendLink = (link) => {
    link.open = !link.open
}

/**
 * OpenTab and push to the router
 * @param {*} route
 */
const openTab = (route) => {
    tabsStore.openTab(route)
}
</script>

<template>
    <nav class="mt-5 space-y-1 no_highlights w-full overflow-x-hidden">
        <a
            v-for="link in data"
            :key="link.name"
            v-permission="{ name:link.permission }"
            class="cursor-pointer"
            @click="() => (!link.children ? openTab(link) : extendLink(link))" >
            <!-- First level link -->
            <div :class="[
                route.name == link.name
                    ? 'bg-gray-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                'flex items-center px-6 py-3 text-base capitalize font-medium relative transition-all']">

                <component
                    :is="link.icon"
                    :class="[
                        route.name == link.name
                            ? 'text-primary-600'
                            : 'text-gray-400',
                        'mr-4 h-6 w-6 flex-shrink-0',
                    ]"
                    aria-hidden="true" />

                {{ $t(link.meta?.title || link.name) }}

                <ChevronDownIcon
                    v-if="link.children && (sidebarWidth > defaultSidebarWith || sidebarWidth === null)"
                    :class="{ 'rotate-180': link.open && link.children, 'text-primary-500': link.open,}"
                    class="w-5 h-5 text-black self-end absolute right-4 top-[12px] transition-all"
                    aria-hidden="true" />
            </div>

            <!-- Second level link -->
            <div v-show="link.children && link.open" class="w-full mb-2">
                <NavigationItem
                    v-if="link.children"
                    :data="link.children"
                    :parent="link" />
            </div>
        </a>
    </nav>
</template>

<style>
.no_highlights {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}
</style>
