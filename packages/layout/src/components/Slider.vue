<script setup>
/**
 * --------------------------------------------------------------
 * Slider
 * --------------------------------------------------------------
 *
 *  Implements a flexible container with dynamic height animation capabilities.
 *  It supports two slots: the default slot and an alternate slot ("alternativeSlot").
 *
 *  The component can be configured to be initially open or closed,
 *  and it allows toggling between the default and alternate slots with a smooth
 *  height transition using GSAP animations.
 *
 *  Features:
 *  - Dynamic height adjustment based on content in the default and alternate slots.
 *  - Toggle between the default and alternate slots by clicking on the component.
 *  - Smooth opening and closing animations using GSAP.
 *
 *  Props:
 *  - isOpen: Boolean prop to control the state of the component (open/closed).
 *  - showAlternativeSlot: Boolean prop to determine which slot to display initially.
 *
 *  Usage Example:
 *  <ToggleableSlider :isOpen="true" :showAlt="false">
 *      <!-- Default slot content goes here -->
 *
 *      <template #alternativeSlot>
 *          <!-- Alternative slot content goes here -->
 *      </template>
 *  </ToggleableSlider>
 */

import { ref, nextTick, watch, onMounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps({
    isOpen: Boolean,
    showAlternativeSlot: Boolean
})

const slider = ref(null)
const content = ref(null)

onMounted(() => {
    // Detect changes in the height of nested elements
    const resizeObserver = new ResizeObserver((a) => {
        a && (a[0].contentRect.height !== 0) && animateHeight()
    })

    resizeObserver.observe(content.value)

    // Initial state
    gsap.from(slider.value, { height: 0 })
})

// Animate the new height of the component when the slot changes
watch(
    () => props.showAlternativeSlot,
    async () => {
        // Wait for DOM to update after changing the slot
        await nextTick()

        animateHeight()
    },
    // Trigger the watch callback immediately
    { immediate: true }
)

// Opens and closes the component
watch(
    () => props.isOpen,
    () => {
        animateHeight()
    }
)

// Function to animate the height of the component
function animateHeight () {
    // Calculate the target height based on isOpen prop
    const targetHeight = props.isOpen ? content.value.clientHeight : 0

    // Use GSAP to animate the height
    gsap.to(slider.value, {
        height: targetHeight,
        duration: 0.5
    })
}
</script>

<template>
    <div
        ref="slider"
        class="overflow-hidden !mt-0">
        <div
            ref="content">
            <!-- Default slot -->
            <slot
                v-if="!showAlternativeSlot" />

            <!-- Alternative slot -->
            <slot
                v-if="showAlternativeSlot"
                name="alternativeSlot" />
        </div>
    </div>
</template>
