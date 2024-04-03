<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
    originId: {
        type: String,
        default: null
    },
    destinationId: {
        type: String,
        default: null
    },
    color: {
        type: String,
        default: 'gray'
    },
    size: {
        type: String,
        default: 'md'
    },
    space: {
        type: String,
        default: 'md'
    },
    finalArrow: {
        type: Boolean,
        default: false
    },
    animationDuration: {
        type: Number,
        default: 5
    },
    vertical: {
        type: Boolean,
        default: false
    }
})

const elementOrigin = ref(null)
const elementDestination = ref(null)

const colors = {
    gray: '#cbd5e1',
    primary: '#303F9F',
    danger: '#ef4444',
    warning: '#eab308',
    success: '#22c55e',
    info: '#3b82f6'
}

const sizes = {
    xs: '1',
    sm: '2',
    md: '3',
    lg: '4',
    xl: '5',
    '2xl': '6',
    '3xl': '7',
    '4xl': '8',
    '5xl': '9',
    '6xl': '10'
}

const finalPosition = () => {
    if (props.originId && props.destinationId) {
        elementOrigin.value = document.getElementById(props.originId)
        elementDestination.value = document.getElementById(props.destinationId)
    }
}

const offset = (el) => {
    const rect = el.getBoundingClientRect()

    const scrollLeft = document.documentElement.scrollLeft

    const scrollTop = document.documentElement.scrollTop

    return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        right: rect.right + scrollLeft,
        bottom: rect.bottom + scrollTop,
        height: rect.height,
        width: rect.width,
        scrollTop,
        scrollLeft
    }
}

const startPosition = computed(() => {
    const position = { }
    if (elementOrigin.value && elementDestination.value) {
        const originRect = offset(elementOrigin.value)

        if (!props.vertical) {
            position.x = originRect.right

            position.y = originRect.top - originRect.scrollTop + (originRect.height / 2)
        }

        if (props.vertical) {
            position.x = originRect.left + (originRect.width / 2)

            position.y = originRect.bottom - originRect.scrollTop
        }
    }
    return position
})

const endPosition = computed(() => {
    const position = { }
    if (elementDestination.value && elementDestination.value) {
        const destinationRect = elementDestination.value.getBoundingClientRect()

        if (!props.vertical) {
            position.x = destinationRect.left

            position.y = destinationRect.top + (destinationRect.height / 2)
        }

        if (props.vertical) {
            position.x = destinationRect.left + (destinationRect.width / 2)

            position.y = destinationRect.top
        }
    }
    return position
})

const recalculate = () => {
    elementOrigin.value = null
    elementDestination.value = null

    finalPosition()
}

onMounted(() => {
    finalPosition()

    new ResizeObserver(() => {
        recalculate()
    }).observe(document.getElementById('main-page'))

    document.addEventListener('scroll', (event) => {
        console.log('FRom scroll')
        elementOrigin.value = null
        elementDestination.value = null

        finalPosition()
    })
})

defineExpose({ recalculate })
</script>

<template>
    <svg :id="`${originId}-${destinationId}`" class="fixed left-0 top-0 !overflow-visible z-10 bg-primary-500" >
        <defs>
            <marker
                v-if="finalArrow"
                id="triangle"
                viewBox="0 0 10 10"
                refX="1"
                refY="5"
                markerUnits="strokeWidth"
                markerWidth="3"
                markerHeight="3"
                orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#9E9E9E" />
            </marker>
        </defs>

        <path
            v-if="startPosition.x && startPosition.y && endPosition.x && endPosition.y"
            class="z-50"
            :d="`M ${startPosition.x} ${startPosition.y} L ${endPosition.x} ${endPosition.y}`"
            stroke-miterlimit="10"
            fill="none"
            :stroke="colors[color] || colors['gray']"
            :stroke-width="sizes[size]"
            :stroke-dasharray="sizes[space]"
            marker-end="url(#triangle)"
            transform="translate(0, 0)">
            <animate
                attributeName="stroke-dashoffset"
                values="100;0"
                :dur="`${animationDuration}s`"
                calcMode="linear"
                repeatCount="indefinite" />
        </path>
    </svg>
</template>
