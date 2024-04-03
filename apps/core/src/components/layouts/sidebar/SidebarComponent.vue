<script setup>
import { ref, inject } from 'vue'
import ApplicationLogo from './ApplicationLogo.vue'
import NavigationMenu from './NavigationMenu.vue'
import SidebarMainContent from './SidebarMainContent.vue'
import SidebarWrapper from './SidebarWrapper.vue'
import FacilitySelect from './FacilitySelect.vue'

const props = defineProps(['sidebarOpen', 'navigationLinks', 'toggleSidebar'])

const emit = defineEmits(['contentWidth'])

const sidebarWidth = ref('')

const useStore = inject('useStore')

const coreStore = useStore('core')

const contentWidth = (value) => {
    emit('contentWidth', value)

    sidebarWidth.value = value
}

const forceOpen = ref(false)
const isOpen = ref(false)

const forceOpenDesktopSidebar = () => {
    forceOpen.value = !forceOpen.value
}

const isSidebarOpen = (value) => {
    isOpen.value = value
}
</script>

<template>
    <SidebarWrapper
        :openSidebar="props.sidebarOpen"
        :forceOpenDesktopSidebar="forceOpen"
        :toggleSidebar="props.toggleSidebar"
        @contentWidth="contentWidth"
        @isSidebarOpen="isSidebarOpen">
        <!-- Mobile sidebar -->
        <template v-slot:MenuMobile>
            <SidebarMainContent>
                <template v-slot:ApplicationLogo>
                    <ApplicationLogo />
                </template>

                <template v-slot:NavigationMenu>
                    <NavigationMenu
                        :isMinified="true"
                        :navigationLinks="props.navigationLinks"
                        :sidebarWidth="null" />
                </template>

                <template v-slot:SelectDropdown>
                    <!-- <SelectDropdown /> -->
                    <FacilitySelect />
                </template>
            </SidebarMainContent>
        </template>

        <!-- Desktop sidebar -->
        <template v-slot:MenuDesktop>
            <SidebarMainContent>
                <template v-slot:ApplicationLogo>
                    <ApplicationLogo />
                </template>

                <template v-slot:NavigationMenu>
                    <NavigationMenu
                        @openTab="forceOpenDesktopSidebar"
                        class="w-48 transition-all duration-300"
                        :class="{ 'mt-[65px]' : sidebarWidth < 61 }"
                        :sidebarWidth="sidebarWidth"
                        :navigationLinks="props.navigationLinks"
                        :isSidebarOpen="isOpen" />
                </template>

                <template v-slot:SelectDropdown>
                    <FacilitySelect />

                    <div
                        v-if="coreStore.appVersion?.frontendversion"
                        class="mx-auto">
                        v.{{ coreStore.appVersion?.frontendversion }}
                    </div>
                </template>
            </SidebarMainContent>
        </template>
    </SidebarWrapper>
</template>
