<script setup>
import { ref, onBeforeMount, onMounted, inject, watch } from 'vue'
import { initGlobalStores } from '@/store/stores'
import Tabs from './Tabs.vue'
import { useRoute, useRouter } from 'vue-router'
import { navigation as navs } from '../../router/navigation'
import SidebarComponent from './sidebar/SidebarComponent.vue'
import HeaderComponent from './header/HeaderComponent.vue'
import { Overlay, ConfirmationModal } from 'layout'
import UpdateCard from './UpdateCard.vue'
import GlobalAlert from './GlobalAlert.vue'

const route = useRoute()
const router = useRouter()

const useStore = inject('useStore')

const layoutManagerStore = useStore('layoutManager')
const rapidStore = useStore('rapidStore')

const navigation = navs()

const sidebarOpen = ref(false)
const toggle = ref(true)
const isRoute = ref(false)

const contentWidth = ref()

const tabsStore = useStore('tabs')

const width = (width) => {
    contentWidth.value = width
}

onMounted(() => {
    isRoute.value = router.currentRoute.value.meta?.route
})

// Listen for route changes to determine if it will open in a tab or directly as a route.
watch(() => route.path, (nPath, oPath) => {
    if (route.matched.length === 0) {
        return router.push({ path: '/' })
    }

    if (router.currentRoute.value.meta?.route) {
        isRoute.value = true

        return
    }

    tabsStore.restoreSessionTabs()

    const currentRoute = router.currentRoute.value

    tabsStore.openTab(currentRoute)

    isRoute.value = false
}, { deep: true })

onBeforeMount(() => {
    const coresStore = useStore('core')

    if (coresStore.credentials) initGlobalStores({ useStore })
})
</script>

<template>
    <Overlay
        v-if="layoutManagerStore.globalOverlay.show" />

    <router-view
        v-if="isRoute" />

    <SidebarComponent
        :navigationLinks="navigation"
        :sidebarOpen="sidebarOpen"
        :toggleSidebar="toggle"
        @contentWidth="width"
        v-if="!isRoute" />

    <div
        v-if="!isRoute"
        class="js-content flex flex-1 flex-col h-full"
        :style="{ paddingLeft: contentWidth + 'px' }">
        <UpdateCard
            v-if="layoutManagerStore.versionUpdater.card"
            :position="layoutManagerStore.versionUpdater.position" />

        <GlobalAlert />

    <!-- Confirmation modal to update facility selection -->
    <ConfirmationModal
        :description="$t('Your session has ended, please log in again.')"
        :title="$t('Confirmation')"
        :has-cancel="false"
        v-model="layoutManagerStore.confirmationModal.show"
        @confirm="rapidStore.$emitGlobalEvent('force:logout')"
        :confirmation-button-label="$t('OK')"
        type="danger"
        class="z-50" />

        <HeaderComponent
            :toggle-hamburger-icon="toggle"
            @open-sidebar="sidebarOpen=!sidebarOpen"
            @toggle-sidebar="toggleSidebar()" />

        <Tabs />
    </div>
</template>
