<script setup>
import { onMounted, watch, ref } from 'vue'
import { mdiChevronLeft } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps(['forceOpenDesktopSidebar'])

const emit = defineEmits(['contentWidth', 'isOpen'])

const resetWidth = 224

// Default sidebar width in px
const defaultSidebarWidth = ref()

const styleSidebarWidth = ref(defaultSidebarWidth.value)

const lastSidebarWidth = ref(defaultSidebarWidth.value)

const open = ref(true)

const maxResizeWidth = 700
const minResizeWidth = 160

const completeWidth = ref('')

const toggleSidebar = (forceClose) => {
    if (!forceClose) {
        open.value = !open.value
    } else {
        open.value = false
    }

    // Opens and closes the sidebar based on the last open position.
    styleSidebarWidth.value = open.value ? lastSidebarWidth.value : 58

    setStateInLocalStorage(open.value)

    emitState()
}

const emitState = () => {
    open.value ? emit('isOpen', true) : emit('isOpen', false)
}

const setStateInLocalStorage = () => {
    if (open.value) {
        localStorage.setItem('sidebar', 'open')
    } else {
        localStorage.setItem('sidebar', 'close')
    }
}

const getStateFromLocalStorage = () => {
    // Gets and re-sets open and close state
    if (localStorage.getItem('sidebar')) {
        if (localStorage.getItem('sidebar') === 'open') {
            open.value = true

            setStateInLocalStorage(open.value)
        } else {
            open.value = false

            setStateInLocalStorage(open.value)
        }
    }

    // Gets and re-sets lastSidedarWidth value
    if (localStorage.getItem('lastSidebarWidth') && localStorage.getItem('lastSidebarWidth') >= resetWidth) {
        defaultSidebarWidth.value = localStorage.getItem('lastSidebarWidth')

        lastSidebarWidth.value = localStorage.getItem('lastSidebarWidth')
    } else {
        defaultSidebarWidth.value = resetWidth

        lastSidebarWidth.value = resetWidth
    }
}

onMounted(() => {
    // Gets and re sets the state in the LocalStorage of the Sidebar at the onMounted time.
    getStateFromLocalStorage()

    emitState()

    initResizer()

    // Hide the sidebar on mobile during onmounted
    resizeContentWidth()
})

// Emits the width of the sidebar to resize the main content in the app layout.
watch(() => styleSidebarWidth.value, (value) => {
    emit('contentWidth', styleSidebarWidth.value)
})

watch(() => props.forceOpenDesktopSidebar, () => {
    styleSidebarWidth.value = lastSidebarWidth.value || defaultSidebarWidth.value

    open.value = true

    emitState()

    setStateInLocalStorage(open.value)
})

// Hide and show the Sidebar automatically according to the user's screen resolution.
addEventListener('resize', () => {
    resizeContentWidth()
})

const resizeContentWidth = () => {
    if (window.innerWidth < 1024) {
        styleSidebarWidth.value = 0
    } else {
        styleSidebarWidth.value = open.value ? defaultSidebarWidth.value : 58
    }
}

const initResizer = () => {
    const resizer = document.querySelector('.resizer')
    const sidebar = document.querySelector('.sidebar')
    const content = document.querySelector('.js-content')

    // Emit ContentWidth on initialization to adjust the width of the content according to the width of the sidebar.
    emit('contentWidth', styleSidebarWidth.value)

    let x, width

    resizer.addEventListener('mousedown', rsMousedownHandler)

    // track current mouse position in x var
    function rsMousedownHandler (e) {
        x = e.clientX

        const sidebarWidth = window.getComputedStyle(sidebar).width

        width = parseInt(sidebarWidth, 10)

        document.addEventListener('mousemove', rsMousemoveHandler)

        document.addEventListener('mouseup', rsMouseupHandler)
    }

    function rsMousemoveHandler (e) {
        // Disables 'select' functionality while resizing sidebar.
        document.body.classList.add('select-none')

        // Disables css animations while resizing sidebar.
        sidebar.classList.remove('transition-all', 'duration-300')
        content.classList.remove('transition-all', 'duration-300')

        // Complete width
        completeWidth.value = width + e.clientX - x

        // To prevent opening the sidebar beyond the allowed limits.
        if (completeWidth.value < maxResizeWidth) {
            styleSidebarWidth.value = completeWidth.value

            lastSidebarWidth.value = completeWidth.value

            localStorage.setItem('lastSidebarWidth', completeWidth.value)

            open.value = true
        }
    }

    function autoCloseSidebar () {
        /*
        | If the sidebar resizes lower than minResizeWidth:
        */
        if (completeWidth.value < minResizeWidth && completeWidth.value > minResizeWidth - 20) {
            styleSidebarWidth.value = minResizeWidth + 20

            return
        }

        if (completeWidth.value < minResizeWidth) {
            const forceClose = true

            // Force close the sidebar
            toggleSidebar(forceClose)

            // Resets lastSidebarWidth (opened) to dafault
            lastSidebarWidth.value = resetWidth
        }
    }

    function rsMouseupHandler () {
        // When you release the mouse, it checks if the sidebar should be closed.
        autoCloseSidebar()

        /*
        | remove event mousemove && mouseup
        */
        document.removeEventListener('mouseup', rsMouseupHandler)
        document.removeEventListener('mousemove', rsMousemoveHandler)

        const timeBeforeRemove = 500

        // Re-enable the 'select' functionality after resize sidebar after certain time
        setTimeout(() => {
            document.body.classList.remove('select-none')
        }, timeBeforeRemove)

        // Re-enable css animations after resize sidebar
        sidebar.classList.add('transition-all', 'duration-300')
        content.classList.add('transition-all', 'duration-300')
    }
}
</script>

<template>
    <div
        class="sidebar hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 relative !z-50 group"
        :style="{ width: styleSidebarWidth + 'px' }">
        <slot />

        <div class="resizer w-[2px] absolute top-0 right-0 cursor-col-resize h-full
        bg-gray-300 hover:bg-primary-500 transition-colors duration-200" />

        <svg-icon
            type="mdi"
            :class="{ '!rotate-180 ' : !open, 'opacity-0 group-hover:opacity-100' : open }"
            class="h-[24px] w-[24px] pr-[1px] py-[1px] absolute top-[68px] !z-50 -right-[10px] text-black bg-white
            border-[2px] border-gray-300 hover:bg-primary-500 rounded-full hover:text-white cursor-pointer
            transition-all duration-300"
            @click="toggleSidebar()"
            aria-hidden="true"
            :path="mdiChevronLeft" />
    </div>
</template>
