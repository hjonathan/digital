<script setup>
import { Card, Alert } from 'layout'
import SvgIcon from '@jamescoyle/vue-icon'
import { ForwardIcon } from '@heroicons/vue/24/outline'
import { mdiNotePlusOutline } from '@mdi/js'

const props = defineProps({
    // Prefix used in card to select option to continue
    prefix: {
        type: String,
        default: ''
    },
    // Enable card to add item on grid list
    enableAdd: {
        type: Boolean,
        default: true
    },
    // Used to selected option to skip step
    selectedOption: {
        type: Boolean,
        default: false
    },
    // Custom message and type that show on optional step
    customMessage: {
        type: Object,
        default: null
    }
})

// Events from grid list or waste grid for selection step option to continue
defineEmits(['addContainer', 'skipProccess'])

</script>

<template>
    <section class="full">
        <div
            class="grid grid-cols-2 gap-8 md:w-3/4 xl:w-1/2 mx-auto">
            <!-- Add container option to continue step -->
            <Card
                :disabled="!enableAdd"
                :hasMargins="false"
                hasHover
                @click="enableAdd && $emit('addContainer')"
                :class="{ 'hover:cursor-pointer': enableAdd }"
                class="!h-full">
                <svg-icon
                    :path="mdiNotePlusOutline"
                    type="mdi"
                    size="40"
                    :class="{ 'mx-auto mb-6': true, 'step-card-content': enableAdd }" />

                <div
                    :class="{ 'step-card-text': true, 'step-card-content': enableAdd }">
                    {{ $t(`Add ${prefix}.`) }}
                </div>
            </Card>

            <!-- Skip option to continue step -->
            <Card
                @click="$emit('skipProccess')"
                :hasMargins="false"
                :active="selectedOption"
                hasHover
                class="hover:cursor-pointer !h-full">
                <ForwardIcon
                    :class="{ '!text-primary-500': selectedOption }"
                    aria-hidden="true"
                    class="w-12 mx-auto mb-4 step-card-content" />

                <div
                    :class="{ '!text-primary-500': selectedOption }"
                    class="step-card-content step-card-text">
                    {{ $t(`This process does not have resulting ${prefix}.`) }}
                </div>
            </Card>
        </div>
    </section>
</template>

<style>
.step-card-content {
    @apply text-gray-600;
    @apply group-hover:text-primary-500;
    @apply transition-all;
    @apply duration-300;
}

.step-card-text {
    @apply font-semibold;
    @apply text-center;
}
</style>
