<script setup>
/*
|--------------------------------------------------------------------------
| Title
|--------------------------------------------------------------------------
|
| This component can render a title either as the main slot or through the 'title' property. You can specify the type of
| header to be used through the titleType prop, which defaults to h1.
|
| Include 'inSlideOver' prop to show the title inside SlideOver components (without paddings. Read inSlideOver prop comment for more info).
|
| Availables slots: custom, left, leftTitle, center, centerTitle, right, rightTitle, actions.
|
*/
import { useSlots } from 'vue'

defineProps({
    title: {
        type: String,
        default: null
    },

    // Sets mx to 0, px to 0, mt to 0, pt to 0 and air-sm (mt-3 lg:mt-6) when true (Default: false)
    inSlideOver: {
        type: Boolean,
        default: false
    },

    // Allows removing margins (Default: true)
    hasMargin: {
        type: Boolean,
        default: true
    },

    // Allows removing paddings (Default: true)
    hasPadding: {
        type: Boolean,
        default: true
    },

    // To pass classes directly to Heading tag
    titleClasses: [String, Array],

    // Allows defining the type of header that will be rendered (Default: h1)
    titleType: {
        type: String,
        default: 'h1'
    },

    // To add a breakpoint on devices with resolution less than md '640px' (Default: true)
    hasBreakpoint: {
        type: Boolean,
        default: true
    },

    // To add a 80rem or 1280px maximum width (Default: false)
    hasMaxWith: {
        type: Boolean,
        default: false
    },

    // Use align-start to align the title to the start of the container’s cross axis (Default: false)
    alignStart: {
        type: Boolean,
        default: false
    },

    // Used to show or hide the bottom border of the title. (Default: true)
    hasBorderBottomLine: {
        type: Boolean,
        default: true
    }
})

// Use the `useSlots` function to access slots
const slots = useSlots()
</script>

<template>
    <div
        class="relative"
        :class="{
            'pt-2' : !inSlideOver,
            '!mx-0 !px-0 !mt-0 !pt-0 air-sm' : inSlideOver,
            '!p-0' : !hasPadding,
            'border-b border-gray-200': hasBorderBottomLine
        }">
        <slot name="custom">
            <div
                :class="{
                    'space-y-4 md:space-y-0 md:flex': hasBreakpoint,
                    'flex': !hasBreakpoint,
                    'max-w-8xl mx-auto': hasMaxWith,
                    'mb-2': hasBorderBottomLine,
                }"
                class="items-center justify-between relative h-full">
                <!-- Left (default) panel -->
                <div :class="{ 'self-start':  alignStart }">
                    <slot name="left">
                        <!-- Left -->
                        <component
                            :is="titleType"
                            :class="[titleClasses]"
                            class="!m-0">
                            <!-- LeftTitle slot -->
                            <slot
                                v-if="slots.leftTitle"
                                name="leftTitle" />

                            <!-- Default slot -->
                            <slot />

                            {{ title }}

                            <slot
                                v-if="slots.leftTitleAddon"
                                name="leftTitleAddon" />
                        </component>
                    </slot>
                </div>

                <!-- Center panel -->
                <div v-if="slots.center || slots.centerTitle">
                    <slot name="center">
                        <!-- Center -->
                        <component
                            v-if="slots.centerTitle"
                            :is="titleType"
                            :class="[titleClasses]"
                            class="!m-0">
                            <!-- CenterTitle -->
                            <slot
                                name="centerTitle" />
                        </component>
                    </slot>
                </div>

                <!-- Right panel -->
                <div v-if="slots.right || slots.rightTitle">
                    <slot name="right">
                        <!-- Right -->
                        <component
                            v-if="slots.rightTitle"
                            :is="titleType"
                            :class="[titleClasses]"
                            class="!m-0">
                            <!-- rightTitle -->
                            <slot
                                name="rightTitle" />
                        </component>
                    </slot>

                    <div
                        v-if="slots.actions"
                        class="flex">
                        <!-- Actions -->
                        <slot
                            name="actions" />
                    </div>
                </div>
            </div>
        </slot>
    </div>
</template>
