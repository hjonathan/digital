<script setup>
/*
|--------------------------------------------------------------------------
| Autocomplete
|--------------------------------------------------------------------------
|
| Autocomplete form component based on PrimeVue Autocomplete.
|
*/

import { ref, computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { uniqueId } from 'lodash'
import BaseFormContainer from './BaseFormContainer.vue'
import PrimeVueAutoComplete from 'primevue/autocomplete'

const props = defineProps({
    /*
    | Main
    */
    modelValue: [Object, String, Number],
    options: Object,

    /*
    | Container
    */
    containerId: String,
    containerClass: String,

    /*
    | Label
    */
    labelId: String,
    labelClass: String,

    outline: Boolean,
    size: {
        type: String,
        default: 'standard'
    },

    /*
    | Input
    */
    inputId: String,
    inputClass: String,
    readonly: Boolean,
    disabled: Boolean,
    placeholder: String,
    label: String,
    tag: String,
    extra: String,

    /*
    | Error
    */
    errors: [Object, String],
    errorIcon: Boolean,

    /*
    | grouped
    |
    | True: Items will be gropued in parent/children.
    | False: Only first level items will be availabe.
    */
    grouped: { type: Boolean, default: false },

    /*
    | multiple
    |
    | True: Multiple suggestions to be selected.
    | False: Only one suggestion can be selected.
    */
    multiple: { type: Boolean, default: false },

    /*
    | completeOnFocus
    |
    | True: Show suggestions automatically on focus/click.
    | False: User will have to start typing to show suggestions.
    */
    completeOnFocus: { type: Boolean, default: true },

    /*
    | forceSelection
    |
    | True: Will show suggestions on focus/click.
    | False: User will have to start typing to show suggestions.
    */
    forceSelection: { type: Boolean, default: true },

    /*
    | optionLabel
    |
    | Use as the label dimension of the options
    */
    optionLabel: { type: String, default: 'name' },

    /*
    | optionValue
    |
    | Use as the value dimension of the options
    */
    optionValue: { type: String, default: 'value' },

    /*
    | mapOptions
    |
    | Show selected value based on Value option
    */
    mapOptions: { type: Boolean, default: false },

    /*
    | optionValue
    |
    | It will select only the key value of the selected object and not the entire object.
    */
    emitValue: { type: Boolean, default: false }
})

// Update modelValue
const value = computed({
    get () {
        let newValue = props.modelValue

        if (props.optionValue && props.mapOptions) {
            newValue = props.options.find(option => option[props.optionValue] === props.modelValue)
        }

        return newValue
    },
    set (value) {
        let newValue = value

        if (props.optionValue && props.emitValue) {
            newValue = value[props.optionValue]
        }

        emit('update:modelValue', newValue)
    }
})

/*
|--------------------------------------------------------------------------
| Variables
|--------------------------------------------------------------------------
*/

const emit = defineEmits(['update:modelValue', 'change'])

// Assign an ID if not given one
const inputId = props.inputId ?? uniqueId()

const suggestions = ref()

const sizes = ref({
    sm: 'input-sm',
    md: 'input-md',
    standard: 'input',
    xl: 'input-xl'
})

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

// Wait for search event to complete, then remove focus to allow a new
// 'all' search again when clicking the input
const selected = () => {
    setTimeout(() => {
        document.activeElement.blur()
    }, 50)
}

const search = (event) => {
    if (props.grouped) {
        suggestions.value = groupSearch(event)

        return
    }

    suggestions.value = simpleSearch(event)
}

const showAllOptions = (options) => {
    if (document.activeElement.value) {
        // Auto select input content on focus
        document.activeElement.setSelectionRange(0, document.activeElement.value.length)
    }

    // Show all
    suggestions.value = [...options]

    return suggestions.value
}

// Group search
const groupSearch = (event) => {
    // Re-format options for group search
    const options = props.options.map((option) => {
        // Add child option for single level options
        // This allows the user to search and select single level options
        if (!option.children.length) { return { ...option, children: [option] } }

        return option
    })

    // Show all options
    if (event === 'all' || !event?.query.trim().length) { return showAllOptions(options) }

    // Show options based on user input (mltiple levels)
    const newFilteredItems = []

    for (const option of options) {
        const filteredItems = option.children.filter((option) => {
            return option.name.toLowerCase().includes(event.query.toLowerCase())
        })

        if (filteredItems && filteredItems.length) { newFilteredItems.push({ ...option, ...{ children: filteredItems } }) }
    }

    return newFilteredItems
}

// Single level search
const simpleSearch = (event) => {
    const options = props.options

    // Show all options
    if (event === 'all' || !event?.query.trim().length) { return showAllOptions(options) }

    // Filter based on user input
    return options.filter((option) => {
        return option.name.toLowerCase().includes(event.query.toLowerCase())
    })
}
</script>

<template>
    <BaseFormContainer
        :containerId="containerId"
        :containerClass="containerClass"
        :labelId="labelId"
        :labelClass="labelClass"
        :inputId="inputId"
        :inputClass="inputClass"
        :readonly="readonly"
        :disabled="disabled"
        :errors="errors"
        :errorIcon="errorIcon">
        <PrimeVueAutoComplete
            v-model="value"
            :suggestions="suggestions"
            appendTo="self"
            :inputId="inputId"
            :class="'w-full'"
            :inputClass="[{
                [sizes[size]]: true,
                '!bg-red-100' : errors,
                '!bg-gray-400 !cursor-not-allowed' : readonly || disabled,
                '!shadow-none border-2': outline,
                'border-none': !outline
            },
                inputClass]"
            :placeholder="placeholder"
            :disabled="disabled || readonly"
            :multiple="false"
            :completeOnFocus="completeOnFocus"
            :forceSelection="forceSelection"
            :optionLabel="optionLabel"
            @change="(e)=> emit('change', e)"
            :optionGroupLabel="grouped ? optionLabel : null"
            :optionGroupChildren="'children'"
            @complete="search($event)"
            @focus="search('all')"
            @item-select="selected()">
            <template #item="slotProps">
                <div  class="mb-0 pb-0" :class="grouped ? 'ml-4' : ''">{{ slotProps.item.name }}</div>
            </template>
        </PrimeVueAutoComplete>

        <ChevronDownIcon class="w-5 h-5 cursor-pointer absolute right-3" style="top: 0.66rem; pointer-events: none;" />

        <template #label v-if="$slots.label || label">
            <slot name="label">
                {{ label }}
            </slot>
        </template>

        <template #tag v-if="$slots.tag || tag">
            <slot name="tag">
                {{ tag }}
            </slot>
        </template>

        <template #extra v-if="$slots.extra || extra">
            <slot name="extra">
                {{ extra }}
            </slot>
        </template>
    </BaseFormContainer>
</template>
