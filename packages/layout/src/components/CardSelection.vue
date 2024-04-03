<script setup>
import Card from './Card.vue'
import Title from './Title.vue'
import { defineModel } from 'shared'
import SvgIcon from '@jamescoyle/vue-icon'

const props = defineProps({
    // Default model v-model
    modelValue: {
        type: [Object, Number, String],
        default: null
    },
    // Determines the orientation of the cards
    vertical: {
        type: Boolean,
        default: false
    },
    // Option list for cards
    options: {
        type: Array,
        default: () => ([])
    },
    // Property displayed below the icon
    optionLabel: {
        type: String,
        default: 'label'
    },
    // Property displayed in card
    optionValue: {
        type: String,
        default: 'value'
    },
    // Custom classes for main container
    containerClass: {
        type: String,
        default: ''
    },
    // Custom classes for card container
    cardClass: {
        type: String,
        default: ''
    },
    // Custom classes for icon
    iconClass: {
        type: String,
        default: ''
    },
    // Custom classes for label
    labelClass: {
        type: String,
        default: ''
    }
})

// Model for card selection
const localModel = defineModel('modelValue')

// Emit value of selected card
const optionSelected = (option) => {
    if (!option.disabled && option[props.optionValue] !== localModel.value) localModel.value = option[props.optionValue]
}

// Gets classes for selected card
const getClasses = (option) => {
    const classes = []

    if (option[props.optionValue] === localModel.value) {
        classes.push('!text-primary-600')
    }

    return classes
}

</script>

<template>
    <!-- Main container -->
    <div :class="`flex ${!vertical ? 'flex-wrap gap-5' : 'flex-col w-full gap-2'} justify-center ${containerClass}`">
        <div
            v-for="(option, index) of options"
            :key="index"
            :class="!vertical ? 'w-96' : 'w-full'">
            <!-- Card container -->
            <Card
                :is-link="true"
                :hasPadding="!vertical"
                :disabled="option.disabled"
                :hasHeaderSeparator="false"
                :active="option[props.optionValue] === localModel"
                @click="optionSelected(option)"
                :class="`h-full ${ !vertical ? 'py-5' : '' }
                    ${option[props.optionValue] !== localModel && !option.disabled ? 'card-action' : ''}
                    ${getClasses(option)} ${cardClass}`">
                <template v-slot:header>
                    <!-- Icon -->
                    <SvgIcon
                        v-if="option.icon"
                        type="mdi"
                        :path="option.icon"
                        :class="`h-16 w-16 mx-auto ${iconClass}`" />
                </template>

                <!-- Label -->
                <Title
                    title-type="h2"
                    :hasPadding="false"
                    :has-border-bottom-line="false"
                    :class="`text-center ${labelClass}`"
                    :title="option[optionLabel]" />
            </Card>
        </div>
    </div>
</template>
