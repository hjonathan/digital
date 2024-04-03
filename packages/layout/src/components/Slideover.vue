<script setup>
/*
|--------------------------------------------------------------------------
| Slideover
|--------------------------------------------------------------------------
| Implements a customizable two-panel slideover interface. It supports a main panel and an optional second panel,
| each with its own header, content, and footer sections. The slideover can be triggered to open and close,
| and it can also handle a second panel for additional functionality.
|
| To use the second panel, you need to pass a boolean value that allows opening and closing it,
| and its content must be defined in the 'mainSecondPanel' slot.
|
| First Panel slots:
| * openSlideTrigger (slot to set a trigger to open the SlideOver)
| * default
| * header
| * footer
|
| Additionally, for both panels if necessary, you can pass the open and close properties to open or close the SlideOver from parent.
|
| Second Panel slots:
| * secondPanelHeader
| * mainSecondPanel
| * secondPanelFooter
|
| Each panel can receive the following props to enable or disable these buttons on each panel. :
| * hasSaveButton
| * hasCancelButton
| * hasSecondPanelSaveButton
| * hasSecondPanelCancelButton
|
| These buttons emit an event() to execute actions from the parent:
| * click-on-cancel
| * click-on-save
| * click-on-second-panel-cancel
| * click-on-second-panel-save
|
| Note: If you use the footer slot in any of the panels, this will disable this functionality.
|
*/

import { ref, watch, computed, onMounted } from 'vue'
import { TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Button, Title } from 'layout'

const props = defineProps({
    /*
    | The title of the main panel. This title will use the <Title> component on the header of the Slideover.
    | Additionally, if you need you can pass a custom header to the firstPanelHeader slot.
    |
    | Same logic for the Second Panel (secondPanelTitle and secondPanelHeader slot).
    */
    title: String,

    // ID that is placed on the right side of the header title (First panel).
    id: [String, Number],

    // ID that is placed on the right side of the header title (Second panel).
    secondPanelId: [String, Number],
    secondPanelTitle: String,

    // Allows closing the slideover from the parent.
    close: Boolean,

    // Allows opening the slideover from the parent.
    open: Boolean,

    // Allows opening the Secon Panel of the slideOver from parent.
    openSecondPanel: Boolean,

    // Allows closing the Secon Panel of the slideOver from parent.
    closeSecondPanel: Boolean,

    // Enables or disables these (save, cancel) buttons on each panel.
    hasSaveButton: {
        type: Boolean,
        default: false
    },

    hasCancelButton: {
        type: Boolean,
        default: false
    },

    hasSecondPanelSaveButton: {
        type: Boolean,
        default: false
    },

    hasSecondPanelCancelButton: {
        type: Boolean,
        default: false
    },

    // Custom title for the save button in the second panel.
    secondPanelSaveButtonTitle: {
        type: String,
        default: null
    },

    // Custom title for the save button in the main panel.
    firstPanelSaveButtonTitle: {
        type: String,
        default: null
    },

    // Custom title for the save button in the main panel.
    firstPanelColorButton: {
        type: String,
        default: 'primary'
    },

    // Custom title for the cancel button in the main panel.
    firstPanelCancelButtonTitle: {
        type: String,
        default: null
    },

    // Callback function triggered on clicking the save button in the main panel.
    onSave: {
        type: Function,
        default: null
    },

    // Callback function triggered on clicking the save button in the second panel.
    onSaveSecondPanel: {
        type: Function,
        default: null
    },

    // Indicates whether the main button is disabled.
    disableSaveButton: {
        type: Boolean,
        default: false
    },

    // Indicates whether the second panel button is disabled.
    disableSeconPanelSaveButton: {
        type: Boolean,
        default: false
    },

    // Callback function triggered on clicking the save button in the second panel.
    onReady: {
        type: Function,
        default: () => {}
    }
})

// Define emitted events
const emit = defineEmits([
    'click-on-cancel',
    'click-on-save',
    'click-on-second-panel-cancel',
    'click-on-second-panel-save',
    'closed',
])

// Reactive variables
const show = ref(false)
const showSecondPanel = ref(false)
const buttonSave = ref({ disabled: false })
const firstPanelWidth = ref()
const firstPanel = ref(null)

// Called from the 'openSlideTrigger' trigger or from the 'open' property to open the Slideover.
const openSlideOver = () => {
    // When the Slideover is opened we register the event that allows closing the slideover through the ESC key
    document.addEventListener('keydown', closeOnEscape)

    show.value = true

    // When the Slideover is opened we disable the scroll functionality in the application
    document.body.style.overflow = 'hidden'

    /*
    | When the Slideover is opened, we use the elementWidthSize method to capture the width of the first panel
    | to assign it to the second one.
    |
    | This functionality needs to be executed from a setTimeout, since the element to reference is not rendered
    | immediately due to the opening animation
    */
    const timeToWaitForTheElement = 1

    buttonSave.value.disabled = false

    setTimeout(() => {
        elementWidthSize()
    }, timeToWaitForTheElement)
}

// Method to close the slideover on Escape key
const closeOnEscape = (e) => {
    if (e.key === 'Escape') {
        // If the second panel is open, close the second panel first, otherwise close the Slideover.
        if (showSecondPanel.value) {
            closeSecondPanel()

            return
        }

        if (!showSecondPanel.value) {
            closeSlideOver()
        }
    }
}

// Close the entire slideOver (First and second panel)
const closeSlideOver = () => {
    // When the Slideover is being closed if the second panel is open, it is also closed.
    if (showSecondPanel.value) showSecondPanel.value = false

    show.value = false

    // Emits a 'closed' event when the closed animation completes
    setTimeout(() => {
        emit('closed')
    }, timeToWaitToCloseAnimation)

    // Remove the listener
    document.removeEventListener('keydown', closeOnEscape)

    // Enable the scroll again.
    document.body.style.overflow = null
}

// Method to close the second panel
const closeSecondPanel = () => {
    showSecondPanel.value = false
}

// Method to handle click on the first panel's Save button
const clickSaveButton = () => {
    // Returns the 'setLoading' function with the click event to manipulate the button state from outside.
    emit('click-on-save', { setButtonToLoading })
}

// Method to handle click on the second panel's Save button
const clickSecondPanelSaveButton = () => {
    // Returns the 'setSecondPanelButtonToLoading' function with the click event to manipulate the button state from outside.
    emit('click-on-second-panel-save', { setSecondPanelButtonToLoading })
}

// Method to calculate the width of the slideover element (first panel).
const elementWidthSize = () => {
    firstPanelWidth.value = firstPanel.value.offsetWidth
}

// Compute the dynamic width for the second panel
const secondPanelWidthClass = computed(() => showSecondPanel.value ? `${firstPanelWidth.value}px` : 0)

// Watchers for props
watch(
    () => props.openSecondPanel,
    () => { showSecondPanel.value = true },
    { deep: true }
)

watch(
    () => props.closeSecondPanel,
    () => { closeSecondPanel() },
    { deep: true }
)

watch(
    () => props.close,
    () => { closeSlideOver() },
    { deep: true }
)

watch(
    () => props.open,
    () => { openSlideOver() },
    { deep: true }
)

// Indicates whether the main button is in a loading state.
const buttonIsLoading = ref(false)

// Indicates whether the second panel button is in a loading state.
const secondPanelButtonIsLoading = ref(false)

/*
| The following methods are exposed and returned along with the button click event,
| allowing them to be manipulated externally to modify the states of the Slideover.
*/

const timeToWaitToCloseAnimation = 501

const setButtonToLoading = (value) => {
    /*
    | We add a 250ms delay (timeToWaitToCloseAnimation) in re-enabling the button after its loading state to allow the
    | Slideover closing animation to finish before re-enabling. The same applies to the button of the second panel (setSecondPanelButtonToLoading).
    */
    if (!value) {
        setTimeout(() => {
            buttonIsLoading.value = value
        }, timeToWaitToCloseAnimation)

        return
    }

    buttonIsLoading.value = value
}

const setSecondPanelButtonToLoading = (value) => {
    if (!value) {
        setTimeout(() => {
            secondPanelButtonIsLoading.value = value
        }, timeToWaitToCloseAnimation)

        return
    }

    secondPanelButtonIsLoading.value = value
}

onMounted(() => {
    props.onReady({
        setButtonToLoading
    })
})

</script>

<template>
    <!-- Trigger to open the slideover -->
    <div class="flex justify-end">
        <div @click="openSlideOver">
            <slot name="openSlideTrigger" />
        </div>
    </div>

    <!-- Teleport the slideover content to body -->
    <teleport to="body">
        <TransitionRoot as="template" :show="show">
            <div
                class="relative z-50"
                aria-labelledby="slide-over-title"
                role="dialog"
                aria-modal="true">
                <!-- Backdroop -->
                <TransitionChild
                    as="template"
                    enter="ease-in-out duration-500"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="ease-in-out duration-500"
                    leave-from="opacity-100"
                    leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <!-- Outer container for slideover -->
                <div
                    @click.self="closeSlideOver"
                    class="fixed inset-0 overflow-hidden">
                    <!-- Slideover -->
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <!-- First Panel -->
                        <TransitionChild
                            as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full"
                            enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0"
                            leave-to="translate-x-full">
                            <div class="pointer-events-auto fixed right-0 h-full xl:relative block w-11/12 xl:w-max max-w-5xl">
                                <!-- Close button for the first panel -->
                                <TransitionChild
                                    as="template"
                                    enter="ease-in-out duration-500"
                                    enter-from="opacity-0"
                                    enter-to="opacity-100"
                                    leave="ease-in-out duration-500"
                                    leave-from="opacity-100"
                                    leave-to="opacity-0">
                                    <div
                                        id="panel"
                                        class="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                                        <button
                                            @click="closeSlideOver"
                                            type="button"
                                            class="rounded-md text-gray-300 hover:text-white focus:outline-none
                                            focus:ring-2 focus:ring-white">
                                            <span class="sr-only">
                                                {{ $t('Close panel') }}
                                            </span>

                                            <svg
                                                class="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke-width="1.5"
                                                stroke="currentColor"
                                                aria-hidden="true">
                                                <path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </TransitionChild>

                                <!-- Content of the first panel -->
                                <div
                                    class="flex justify-between flex-col bg-white h-full relative
                                    pb-6 shadow-xl overflow-x-hidden"
                                    ref="firstPanel">
                                    <!-- Header of the first panel -->
                                    <div
                                        v-if="title || $slots.header"
                                        class="px-4 pt-6 sm:px-8 sticky top-0 bg-white z-20">
                                        <!-- Title component for the header -->
                                        <Title
                                            v-if="title"
                                            in-slide-over
                                            :has-breakpoint="false">
                                            {{ title }}

                                            <!-- Right title slot -->
                                            <template
                                                v-if="props.id"
                                                #rightTitle>
                                                {{ id }}
                                            </template>
                                        </Title>

                                        <!-- Header slot -->
                                        <slot name="header" />
                                    </div>

                                    <!-- Main content of the first panel (587px is the min width starting from xl screens '1280px')  -->
                                    <div class="relative px-4 sm:px-8 overflow-y-scroll xl:min-w-[587px] h-full">
                                        <div id="slideOverTeleport" />

                                        <!-- Main content slot -->
                                        <slot />
                                    </div>

                                    <!-- Footer slot or default footer buttons -->
                                    <div class="px-4 sm:px-8">
                                        <slot name="footer" />

                                        <!-- Default footer buttons if no footer slot -->
                                        <div
                                            v-if="!$slots.footer"
                                            :class="{
                                                'justify-between' : hasSaveButton && hasCancelButton,
                                                'justify-end' :!hasSaveButton || !hasCancelButton
                                            }"
                                            class="w-full flex flex-shrink-0 pt-4 border-t border-gray-300 ">
                                            <!-- Cancel button -->
                                            <Button
                                                v-if="hasCancelButton"
                                                :label="firstPanelCancelButtonTitle ? $t(firstPanelCancelButtonTitle) : $t(`Cancel`)"
                                                type="button"
                                                @click="{ closeSlideOver(); $emit('click-on-cancel') }"
                                                color="secondary" />

                                            <!-- Save button -->
                                            <Button
                                                v-if="hasSaveButton"
                                                @click="clickSaveButton()"
                                                :disabled="disableSaveButton"
                                                :loading="buttonIsLoading"
                                                :label="firstPanelSaveButtonTitle ? $t(firstPanelSaveButtonTitle) : $t(`Save`)"
                                                type="submit"
                                                :color="firstPanelColorButton || 'primary'" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransitionChild>

                        <!-- Second Panel -->
                        <div
                            class="pointer-events-auto transition-all duration-500 overflow-hidden xl:relative fixed right-0"
                            :style="{ width: secondPanelWidthClass }">
                            <!-- Back button for mobile view -->
                            <div
                                @click="closeSecondPanel"
                                class="bg-gray-100 w-full xl:hidden">
                                <span class="px-4 sm:px-8 py-4 flex items-center gap-4 cursor-pointer font-semibold
                                text-gray-700 hover:text-gray-600">
                                    <i class="pi pi-chevron-left" />

                                    {{ $t(`Back`) }}
                                </span>
                            </div>

                            <!--  Content of the second panel. (49px is the height of the 'back button' on mobile devices.) -->
                            <div
                                class="flex justify-between flex-col h-[calc(100vh-49px)]  xl:h-screen
                                overflow-x-hidden bg-white xl:border-l-2 border-dashed pb-6"
                                :style="{ width: `${firstPanelWidth}px` }">
                                <!-- Header of the second panel -->
                                <div
                                    v-if="secondPanelTitle || $slots.secondPanelHeader"
                                    class="px-4 pt-6 sm:px-8 sticky top-0 bg-white z-20">
                                    <!-- Title component for the header -->
                                    <Title
                                        v-if="secondPanelTitle"
                                        in-slide-over
                                        :has-breakpoint="false">
                                        {{ secondPanelTitle }}

                                        <!-- Right title slot -->
                                        <template
                                            v-if="props.secondPanelId"
                                            #rightTitle>
                                            {{ secondPanelId }}
                                        </template>
                                    </Title>

                                    <!-- Header slot -->
                                    <slot name="secondPanelHeader" />
                                </div>

                                <!-- Main content slot of the second panel -->
                                <div
                                    class="relative px-4 sm:px-8 pr-2 overflow-y-scroll h-full"
                                    :style="{ width: `${firstPanelWidth}px` }">
                                    <slot name="mainSecondPanel" />
                                </div>

                                <!-- Footer slot or default footer buttons of the second panel -->
                                <div class="px-4 sm:px-8">
                                    <slot name="secondPanelFooter" />

                                    <!-- Default footer buttons if no footer slot -->
                                    <div
                                        v-if="!$slots.secondPanelFooter"
                                        :class="{
                                            'justify-between' : hasSecondPanelSaveButton && hasSecondPanelCancelButton,
                                            'justify-end' :!hasSecondPanelSaveButton || !hasSecondPanelCancelButton
                                        }"
                                        class="w-full flex flex-shrink-0 pt-4 border-t border-gray-200">
                                        <!-- Cancel button -->
                                        <Button
                                            v-if="hasSecondPanelCancelButton"
                                            :label="$t(`Cancel`)"
                                            type="button"
                                            @click="{ closeSecondPanel(); $emit('click-on-second-panel-cancel') }"
                                            color="secondary" />

                                        <!-- Save button -->
                                        <Button
                                            v-if="hasSecondPanelSaveButton"
                                            @click="clickSecondPanelSaveButton"
                                            :label="secondPanelSaveButtonTitle ? $t(secondPanelSaveButtonTitle) : $t(`Save`)"
                                            :disabled="disableSeconPanelSaveButton"
                                            :loading="secondPanelButtonIsLoading"
                                            type="submit"
                                            :color="primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TransitionRoot>
    </teleport>
</template>
