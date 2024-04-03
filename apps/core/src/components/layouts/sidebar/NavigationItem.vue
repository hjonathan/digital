<script setup>
import { inject } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps(['data', 'parent'])

const route = useRoute()

const useStore = inject('useStore')
const tabsStore = useStore('tabs')

/**
 * OpenTab and push to the router
 * @param {*} link
 */
const openTab = (route) => {
    tabsStore.openTab(route)
}
</script>

<template>

    <a
        v-for="link in props.data"
        :key="link.name"
        @click.prevent.stop="openTab(link)"
        v-permission="{ name:link.permission }"
        :class="[
            route.name === link.name
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'group flex w-full items-center rounded-md px-6 py-3 text-base font-medium capitalize'
        ]">
        <div class="pl-10">
            {{ $t(link.meta?.title || link.name) }}
        </div>

        <NavigationItem 
            v-if="link.child" 
            :data="link.child" />
    </a>
</template>
