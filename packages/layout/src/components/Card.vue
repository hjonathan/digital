<script setup>
/**
 * Customizable card element with various dynamic features.
 *
*  Props:
 *      isLink: Determines if the card behaves as a link.
 *      header: Optional header text for the card.
 *      placeContentCenter: Controls whether to place content in the center.
 *      hasHeaderSeparator: Indicates if a separator line should be added below the header.
 *      hasFooterSeparator: Indicates if a separator line should be added above the footer.
 *      active: Indicates an active state for the card.
 *      disabled: Indicates a disabled state for the card.
 *      isClosable: Enables the card to be closable, with a toggle icon.
 *      open: Controls (v-model) the open state of the card.
 *
 * Slots:
 *      header: Custom content for the header section.
 *      footer: Custom content for the footer section.
 *
 * Dynamic Behavior:
 *      The card's appearance changes based on props (e.g., active, isLink, isClosable).
 *      Clicking the header toggles the card's open/closed state (if closable).
 *      The card supports customizable separators and centering of content.
 *      Closable cards feature a rotating Chevron icon to indicate open/close state.
 *
 * Usage:
 *      Customize appearance and behavior by adjusting props and providing slot content.
 *      To enable closable functionality, pass the prop 'isClosable' and synchronize the 'open' state using v-model with an external boolean variable.
 *
 * Example Usage:
 *      <Card
 *          isLink
 *          header="Card Title"
 *          :open="isOpen"
 *          :isClosable="true">
 *          <!-- Card content goes here -->
 *      </Card>
 */

import { useSlots, computed } from 'vue'

import { ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    // Prop to determine if the component should behave as a link (default: false)
    isLink: {
        type: Boolean,
        default: false
    },

    // Prop for providing a header text (optional)
    header: String,

    // Prop to control whether to place the content in the center (default: true)
    placeContentCenter: {
        type: Boolean,
        default: true
    },

    // Prop to determine if a separator line should be added below the header (default: true)
    hasHeaderSeparator: {
        type: Boolean,
        default: true
    },

    // Prop to determine if a separator line should be added above the footer (default: true)
    hasFooterSeparator: {
        type: Boolean,
        default: true
    },

    // Prop to indicate if the component is in an active state
    active: Boolean,

    // Prop to indicate if the component is in a disabled state
    disabled: Boolean,

    flat: Boolean,

    isClosable: {
        type: Boolean,
        default: false
    },

    open: {
        type: Boolean,
        default: false
    },

    headerTextAlign: {
        type: String,
        default: 'text-start'
    },

    hasPadding: {
        type: Boolean,
        default: true
    },
    headerClass: {
        type: String
    },
    bodyClass: {
        type: String
    },
    footerClass: {
        type: String
    }
})

// Use the `useSlots` function to access slots
const slots = useSlots()

/* const computedOpen = ref(false)
*/

const emit = defineEmits(['update:open', 'clickInTopSection', 'clickInBottomSection'])

// Handling the open state
const computedOpen = computed({
    get: () => props.open,
    set: (newValue) => emit('update:open', newValue)
})

// Toggles the card's open state
const openCard = () => {
    computedOpen.value = !computedOpen.value
}
</script>

<template>
    <!-- Container div with dynamic classes based on props -->
    <div
        :class="{
            'ring-2 ring-primary-600' : active,
            'hover:shadow-xl transition-all duration-300' : isLink,
            'cursor-pointer' : isLink && !disabled,
            'cursor-pointer card-action card-action-hover hover:shadow-lg transition-all': isClosable && !computedOpen,
            'h-min' : isClosable && !computedOpen,
            'bg-white shadow-md border-transparent' : !flat,
            'bg-gray-100 border-gray-200' : flat,
            '!border-0':  slots.topSection || slots.bottomSection
        }"
        class="group max-w-8xl rounded-lg border-2 h-full">
        <!-- Main content flex container with dynamic classes based on props -->
        <div
            class="flex flex-col justify-between h-full"
            :class="{ 'opacity-30 cursor-not-allowed' : disabled }">
            <!-- Header section -->
            <header
                v-if="slots.header || header"
                @click="openCard"
                :class="[{
                    'border-b border-gray-200' : hasHeaderSeparator,
                    'hover:text-primary-600': isClosable && computedOpen,
                    'cursor-pointer ': isClosable,

                }, headerClass]"
                class="px-4 md:px-8 pb-4 relative pt-4 md:pt-5">
                <!-- Render header text if provided -->
                <h2
                    v-if="header"
                    :class="headerTextAlign"
                    class="!my-0">
                    {{ $t(header) }}
                </h2>

                <ChevronDownIcon
                    v-if="isClosable"
                    :class="{ 'rotate-180' : computedOpen }"
                    class="w-8 absolute top-4 right-4 md:right-[22px] transition-all duration-300" />

                <!-- Render header slot content if provided -->
                <slot name="header" />
            </header>

            <!-- Body and footer -->
            <div
                v-if="computedOpen || !isClosable"
                :class="{ 'pb-4 md:pb-5 mt-6' : hasPadding }"
                class="flex-1 h-full flex flex-col justify-between">
                <!-- Main slot (Body section) -->
                <main
                    :class="[{
                        'grid !gap-0 place-content-center' : placeContentCenter,
                        'px-4 md:px-8' : hasPadding && !(slots.topSection || slots.bottomSection),
                    }, bodyClass]"
                    class="flex-1">
                    <slot />

                    <!-- Slots to add top and bottom sections (Used in the TwoSectionsCard component) -->
                    <div
                        v-if="slots.topSection || slots.bottomSection"
                        class="divide-y divide-y-gray-300 h-[50%]">
                        <div
                            @click="emit('clickInTopSection')"
                            :class="`h-full hover:bg-primary-500 hover:text-white  transition-colors cursor-pointer duration-150 ${hasPadding ? 'py-4' : ''}`">
                            <slot name="topSection" />
                        </div>

                        <div
                            @click="emit('clickInBottomSection')"
                            :class="`h-full hover:bg-primary-500 hover:text-white  transition-colors cursor-pointer duration-150 ${hasPadding ? 'py-4' : ''}`">
                            <slot name="bottomSection" />
                        </div>
                    </div>
                </main>

                <!-- Footer section. Render footer slot content if provided  -->
                <footer
                    v-if="slots.footer"
                    class="px-4 md:px-8 mt-6 pt-4"
                    :class="[{ 'border-t border-gray-100' : hasFooterSeparator }, footerClass]">
                    <slot name="footer" />
                </footer>
            </div>
        </div>
    </div>
</template>
