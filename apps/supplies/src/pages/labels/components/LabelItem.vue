<script setup>
import { reactive, ref, watch } from 'vue'
import { AutoComplete, Input } from 'form'

import { TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
    // List of available label elements
    elements: Object,

    modelValue: {
        type: Object,
        default: () => {
            // Default values for the label element model
            return {
                element: {},
                x: null,
                y: null,
                width: null,
                size: null,
                is_bold: null,
                name: '',
                label: '',
                field: '',
                type: ''
            }
        }
    },

    errors: Object
})

// Store the current label element model
const labelElementReactive = ref(props.modelValue)

const qrCode = 'QR Code'

const freeText = 'Free text'

// Tracks whether QR Code is selected
const qrCodeIsSelected = labelElementReactive.value.name === qrCode ? ref(true) : ref(false)

// Handles changes when selecting a label element
const elementChange = (event) => {
    // Set selectedElement by id
    const selectedElement = props.elements.find(function (element) {
        return element.id === event
    })

    if (selectedElement === undefined) {
        return
    }

    // Set additional attributes based on the selected element
    labelElementReactive.value.name = selectedElement?.name
    labelElementReactive.value.label = selectedElement?.label
    labelElementReactive.value.field = selectedElement?.field
    labelElementReactive.value.type = selectedElement?.type

    if (selectedElement.id !== 'free_text') {
        labelElementReactive.value.text = ''
    }

    // Set QR Code variable to control layout
    selectedElement.name === qrCode ? qrCodeIsSelected.value = true : qrCodeIsSelected.value = false
}

// Toggle the 'bold' attribute
const toggleBold = () => {
    labelElementReactive.value.is_bold = !labelElementReactive.value.is_bold
}

// Handles changes in the labelElementReactive object
watch(
    () => labelElementReactive,
    () => {
        elementChange(labelElementReactive.value.element_id)
    },
    { deep: true }
)

watch(
    () => props.modelValue,
    () => {
        labelElementReactive.value = props.modelValue
    },
    { deep: true }
)

const emit = defineEmits(['remove'])
</script>

<template>
    <!-- Grid layout for label element form -->
    <div class="grid md:grid-cols-12 gap-3">
        <div class="md:col-span-11"> <!-- This DIV is necessary, otherwise the validation message will be misaligned -->
            <!-- AutoComplete component for selecting a label element -->
            <AutoComplete
                v-model="labelElementReactive.element_id"
                :placeholder="$t('Select')"
                :options="elements"
                :errors="errors?.element_id"
                containerClass="relative pt-0"
                option-value="id"
                emit-value
                map-options
                class="!my-0" />
        </div>

        <!-- Remove the label element -->
        <button
            @click="emit('remove')"
            type="button"
            color="primary"
            class="button !px-0 !py-3 hover:delete hover:outline w-20 md:w-full md:col-span-1 h-min">
            <TrashIcon
                class="w-5 h-5 m-auto"
                aria-hidden="true" />
        </button>

        <div class="md:col-span-3">
            <!-- X-coordinate -->
            <Input
                v-model="labelElementReactive.x"
                :type="'number'"
                :step="'.1'"
                :min="'0'"
                inputClass="text-right"
                :errors="errors?.x ? errors?.x : null"
                :inline-label-left="$t('X')"
                :inline-label-right="$t('cm')" />
        </div>

        <div class="md:col-span-3">
            <!-- Y-coordinate -->
            <Input
                v-model="labelElementReactive.y"
                :type="'number'"
                :step="'.1'"
                :min="'0'"
                inputClass="text-right"
                :errors="errors?.y ? errors?.y : null"
                :inline-label-left="$t('Y')"
                :inline-label-right="$t('cm')" />
        </div>

        <div
            v-if="qrCodeIsSelected"
            class="md:col-span-5">
            <!-- QR Code size -->
            <Input
                v-model="labelElementReactive.size"
                :type="'number'"
                :step="'1'"
                :min="'0'"
                inputClass="text-right"
                :errors="errors?.size ? errors.size : null"
                :inline-label-left="$t('QR Code Size')"
                inline-label-right="cm" />
        </div>

        <div
            v-if="!qrCodeIsSelected"
            class="md:col-span-5">
            <!-- Input field for font size (non-QR Code elements) -->
            <Input
                v-model="labelElementReactive.font_size"
                :type="'number'"
                :step="'1'"
                :min="'0'"
                inputClass="text-right"
                :errors="errors?.font_size ? errors.font_size : null"
                :inline-label-left="$t('Font size')"
                inline-label-right="pt" />
        </div>

        <!-- Toggles 'bold' attribute (non-QR Code elements) -->
        <button
            v-if="!qrCodeIsSelected"
            @click="toggleBold"
            type="button"
            class="button w-full block justify-center px-0 mt-3 lg:mt-6 md:col-span-1 h-min"
            :class="labelElementReactive.is_bold ? '!bg-gray-50 !font-black' : '!font-thin'">
            {{ $t('B') }}
        </button>

        <!-- Input field for free text (visible when 'Free text' element is selected) -->
        <Input
            v-if="labelElementReactive.name === freeText"
            v-model="labelElementReactive.text"
            :errors="errors?.text ? errors.text : null"
            :inline-label-left="$t('Free text')"
            class="col-span-2 w-full md:col-span-11" />
    </div>

    <hr class="sm:my-5 !my-8">
</template>
