<script setup>
/**
 * TwoSectionsCard Component
 *
 * Custom card component designed to showcase content in a structured manner. It features two distinct sections,
 * the topSection and bottomSection, each with customizable components, including icons, titles, and content.
 *
 * Features:
 *  - Click events in both sections trigger corresponding emits ('clickInTopSection' and 'clickInBottomSection'),
 *    enabling parent components to respond to user interactions.
 *  - Icons can be provided either as 'Material Desing icons' or as 'HeroIcon', allowing for dynamic icon rendering.
 *    Additionally, slots are available to insert custom content within the icon slots.
 *
 * Usage:
 * To use this card simply provide props for titles, content, and icons in the top and bottom sections.
 * Click events in each section can be handled by listening for the corresponding emits. The use of slots allows for
 * additional customization, facilitating the insertion of custom content within the predefined sections.
 *
 * Example:
 *      <CustomCard
 *          topSectionTitle="Top Section Title"
 *          topSectionContent="Lorem Ipsum"
 *          topSectionIcon="mdi-heart"
 *          @clickInTopSection="handleTopSectionClick"
 *          bottomSectionTitle="Bottom Section Title"
 *          bottomSectionContent="Dolor Sit Amet"
 *          bottomSectionIcon="mdi-star"
 *          @clickInBottomSection="handleBottomSectionClick" />
 *
 * Additional custom content can be added within slots. More examples in the CardExample.vue component
 */
import { useSlots } from 'vue'
import { Card, Title } from 'layout'
import { isFunction } from 'lodash'

import SvgIcon from '@jamescoyle/vue-icon'

defineProps({
    topSectionTitle: String,
    topSectionContent: String,
    bottomSectionTitle: String,
    bottomSectionContent: [String, Number],
    topSectionIcon: [String, Function],
    bottomSectionIcon: [String, Function]
})

const emit = defineEmits(['clickInTopSection', 'clickInBottomSection'])

const slots = useSlots()
</script>

<template>
    <!-- Card component that contains two sections: topSection and bottomSection -->
    <Card
        class="overflow-hidden !h-full"
        :place-content-center="false"
        :has-padding="false"
        @clickInTopSection="emit('clickInTopSection')"
        @clickInBottomSection="emit('clickInBottomSection')">
        <!-- Top Section -->
        <template #topSection>
            <slot name="topSection">
                <div class="grid grid-cols-12 space-x-5">
                    <!-- Left side of the top section containing an icon or slot -->
                    <div class="col-span-4">
                        <Component
                            v-if="topSectionIcon || bottomSectionIcon"
                            :type="isFunction(topSectionIcon) ? null : 'mdi'"
                            :is="isFunction(topSectionIcon) ? topSectionIcon : SvgIcon"
                            :path="isFunction(topSectionIcon) ? null : topSectionIcon"
                            class="h-12 w-12 mx-auto" />

                        <!-- Slot for custom content in the top section icon -->
                        <slot name="topSectionIcon" />
                    </div>

                    <!-- Right side of the top section containing title and content -->
                    <div class="col-span-8">
                        <Title
                            v-if="!slots.topSectionContent"
                            :title="topSectionTitle"
                            title-type="h2"
                            :has-border-bottom-line="false" />

                        <span v-if="!slots.topSectionContent">
                            {{ topSectionContent }}
                        </span>

                         <!-- Slot for custom content in the top section content -->
                        <slot name="topSectionContent" />
                    </div>
                </div>
            </slot>
        </template>

        <!-- Bottom Section -->
        <template #bottomSection>
            <slot name="bottomSection">
                <div class="grid grid-cols-12 space-x-5">
                    <!-- Left side of the bottom section containing an icon or slot -->
                    <div class="col-span-4">
                        <Component
                            v-if="bottomSectionIcon || bottomSectionIcon"
                            :type="isFunction(bottomSectionIcon) ? null : 'mdi'"
                            :is="isFunction(bottomSectionIcon) ? bottomSectionIcon : SvgIcon"
                            :path="isFunction(bottomSectionIcon) ? null : bottomSectionIcon"
                            class="h-12 w-12 mx-auto" />

                        <!-- Slot for custom content in the bottom section icon -->
                        <slot name="bottomSectionIcon" />
                    </div>

                    <!-- Right side of the bottom section containing title and content -->
                    <div class="col-span-8">
                        <Title
                            v-if="!slots.bottomSectionContent"
                            :title="bottomSectionTitle"
                            title-type="h2"
                            :has-border-bottom-line="false" />

                        <span v-if="!slots.bottomSectionContent">
                            {{ bottomSectionContent }}
                        </span>

                        <!-- Slot for custom content in the bottom section content -->
                        <slot name="bottomSectionContent" />
                    </div>
                </div>
            </slot>
        </template>
    </Card>
</template>
