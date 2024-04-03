<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { uuid } from 'shared'

const props = defineProps({
    initialWidth: {
        type: Number,
        default: () => { return 50 }
    },
    id: {
        type: String,
        default: () => { return 'id-floating-container' }
    }
})

// Variables
const id = ref(props.id || uuid())
const opened = ref(false)

onMounted(() => {
    const windowElement = windowPosition()

    const element = document.getElementById(id.value)

    const container = containerPosition()

    // Initial position in x
    gsap.set(element, {
        x: props.initialWidth,
        ease: 'power1.out',
        duration: 0.3
    })

    calcElementPosition(container.top, container.height)

    // Remove behavior in 1024
    if (windowElement.width <= 1024) return true

    // Remove listener TODO
    listenerHandler()
})

const mouseMoveListener = (e) => {
    const elementDom = document.getElementById(id.value)

    if (!elementDom) return

    const element = floatingContainerPosition()

    const windowElement = windowPosition()

    const containerElement = containerPosition()

    if (!element) return

    const menuWidth = windowElement.width - containerElement.width

    const umbral = (containerElement.width * 0.6) + menuWidth

    let umbralLimit = windowElement.width - element.width - 100

    if (opened.value) {
        umbralLimit = element.x - 100

        umbralLimit > e.clientX && close()

        return
    }

    if (e.clientX > umbral) {
        gsap.to(elementDom, {
            duration: (3000 - (e.clientX ^ 2)) / 3000,
            x: props.initialWidth + ((-(e.clientX - umbral) / 10) ^ 2),
            ease: 'power1.out',
            overwrite: 'auto',
            stagger: 0.03
        })
    }
}

// Open and expand the component
const open = () => {
    const container = document.getElementById(id.value)

    opened.value = true

    container && gsap.to(container, {
        duration: 0.35,
        x: -(container.offsetWidth),
        ease: 'power1.out',
        overwrite: 'auto',
        stagger: 0.03
    })

    document.addEventListener('click', listenerCloseContainer)
}

// Close component with animation
const close = () => {
    const container = document.getElementById(id.value)

    opened.value = false

    container && gsap.to(container, {
        duration: 1,
        x: props.initialWidth,
        ease: 'power1.out',
        overwrite: 'auto',
        stagger: 0.03
    })

    document.removeEventListener('click', listenerCloseContainer)
}

// Listener to close the container when press click in other segment
const listenerCloseContainer = (event) => {
    const container = document.getElementById(id.value)

    container && !container.contains(event.target) && close()
}

// Calculate the element position, with sticky or main container
const calcElementPosition = () => {
    const container = containerPosition()
    const sticky = stickyPosition()

    if (container.top > sticky.top) {
        setElement(container.top, container.height)

        return
    }

    if (container.top < sticky.top && sticky.top > 0) {
        setElement(container.top, container.height, 0.15)

        return
    }

    setElement(sticky.top + sticky.height, container.height - sticky.height)
}

const setElement = (top, height, duration = 0) => {
    const container = document.getElementById(id.value)

    container && gsap.to(container, {
        duration,
        height: `${height}px`,
        top: `${top}px`,
        ease: 'power2.inOut',
        overwrite: 'auto',
        stagger: 0
    })
}

// Return the main container data and position
const containerPosition = () => {
    const selectorContainer = document.querySelectorAll('[id*=entryPoint]')

    if (!selectorContainer.length) {
        return {
            height: 0,
            top: 0,
            width: 0
        }
    }

    const result = selectorContainer[0].getBoundingClientRect()

    return {
        height: result.height,
        top: result.top,
        width: result.width
    }
}

// Return the last sticky position on the DOM
const stickyPosition = () => {
    const selectorContainer = document.getElementsByClassName('sticky')

    if (!selectorContainer.length) {
        return {
            height: 0,
            top: 0,
            width: 0
        }
    }

    const result = selectorContainer[selectorContainer.length - 1].getBoundingClientRect()

    return {
        height: result.height,
        top: result.top,
        width: result.width
    }
}

// Return the current element floating container position and data
const floatingContainerPosition = () => {
    const container = document.getElementById(id.value)

    if (!container) {
        return {
            height: 0,
            top: 0,
            width: 0,
            x: 0
        }
    }

    const result = container.getBoundingClientRect()

    return {
        height: result.height,
        top: result.top,
        width: result.width,
        x: result.x
    }
}

// Return the window data position
const windowPosition = () => {
    return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    }
}

// Add & remove listener from window, and clean the last callbacks TODO improve with unmounted implementation in tabs
const listenerHandler = () => {
    window.floating && window.floating[id.value] && window.removeEventListener('mousemove', window.floating[id.value])

    window.floatingScroll && window.floatingScroll[id.value] && window.removeEventListener('scroll', window.floatingScroll[id.value])

    !window.floating && (window.floating = {})

    !window.floatingScroll && (window.floatingScroll = {})

    window.floating[id.value] = mouseMoveListener

    window.floatingScroll[id.value] = calcElementPosition

    window.addEventListener('mousemove', mouseMoveListener)

    window.addEventListener('scroll', calcElementPosition)
}
</script>

<template>
    <div
       :id="id"
       @click="open"
       :class="[`floating-container flex fixed left-[100%] !overflow-scroll`]"
       style="z-index: 9;">
            <slot />
    </div>
</template>

<style>
.floating-container::-webkit-scrollbar {
    display: none;
}
</style>
