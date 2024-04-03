<script setup>
import { computed, inject } from 'vue'
import { HomeIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { Alert } from 'layout'

const useStore = inject('useStore')
const tabsStore = useStore('tabs')

const activeTab = (tab) => {
    tabsStore.activateTab(tab)
}

const closeTab = (name) => {
    tabsStore.closeTab(name)
}

const parentTabActive = computed(() => {
    const { tab } = tabsStore.getActiveTab()

    return tab?.name
})
</script>

<template>
    <!-- Main tabs -->
    <div>
        <nav class="tabs main-tabs">
            <a
                v-for="(tab, index) in tabsStore.getTabs()"
                :key="`firstLevel-${index}`"
                @click="activeTab(tab)"
                :class="tab.active ? 'active' : ''">

                <XMarkIcon
                    v-if="index !== 0"
                    @click="closeTab(tab.name)"
                    class="close-icon" />

                {{ $t(tab.title) || tab.name }}
            </a>
        </nav>

        <!-- Secondary tabs -->
        <nav
            v-if="tabsStore.getActiveTab()?.tab?.name"
            class="tabs secondary-tabs">
            <a
                v-for="(tab, index) in tabsStore.getTabs(parentTabActive)"
                :key="tab.name"
                :href="tab.href"
                @click="activeTab(tab)"
                :class="tab.active ? 'active' : ''">

                <HomeIcon
                    v-if="index === 0"
                    class="home-icon" />

                <XMarkIcon
                    v-if="index !== 0"
                    @click="closeTab(tab.name)"
                    class="close-icon" />

                {{ index !== 0 ? $t(tab.title) || tab.name : null }}
            </a>
        </nav>
    </div>

    <div
        id="globalTeleport"/>

    <!-- Main content -->
    <main id="main-page" class="h-full">
        <router-view v-slot="{ Component }">
            <keep-alive :include="tabsStore.keepAliveTabs">
                <component :is="Component" />
            </keep-alive>
        </router-view>
    </main>
</template>
