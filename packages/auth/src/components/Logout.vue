<script setup>
import { setSessionJSON } from 'shared'
import { onMounted, inject, nextTick } from 'vue'

const useGlobalStore = inject('useGlobalStore')

const coreStore = useGlobalStore('core')
const tabsStore = useGlobalStore('tabs')
const layoutManagerStore = useGlobalStore('layoutManager')

const api = inject('api')

onMounted(async () => {
    // Prevents accessing the logout route when not logged in.
    if (coreStore.credentials === null) {
        redirectToLogin()

        return
    }

    const response = await api.post('logout')

    if (response) {
        // Resets credentials and permissions
        coreStore.setCredentials(null)
        coreStore.setPermissions(null)

        setSessionJSON('sessionTabs', [])
        tabsStore.tabs = []

        redirectToLogin()
    }

    layoutManagerStore.hideModalLogout()
})

const redirectToLogin = () => {
    nextTick(() => {
        tabsStore.openTab({ path: '/login' })
    })
}
</script>

<template>
    <div class="flex items-center justify-center">
        <div class="flex items-center justify-center h-screen">
            <div class="w-40 h-40 border-t-4 border-b-4 border-indigo-400 rounded-full animate-spin" />
        </div>
    </div>
</template>
