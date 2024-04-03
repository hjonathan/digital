<script setup>
import { ref, computed } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { isFunction } from 'lodash'
import { isDisabled, isTypeButton, click, show } from '../utils/buttons'

const props = defineProps({
    params: Object
})

const options = ref(props.params.column.options)
const data = ref(props.params.data)
const column = ref(props.params.column)

// Computed property that return list buttons and dividers if type function
const buttons = computed(() => {
    if (isFunction(options.value.customButtons)) {
        return options.value.customButtons({ data: data.value, column: column.value })
    }

    return options.value.customButtons
})

// Colors list available for quick action buttons
const colors = [
    'hover:text-primary-600',
    'hover:text-yellow-500',
    'hover:text-sky-600',
    'hover:text-teal-600',
    'hover:text-warning-600',
    'hover:text-pink-600',
    'hover:text-red-600',
]

/**
 * Gets the classes defined based on the configuration of the list item.
 * @param {*} button Element of the list from which the classes will be extracted.
 */
const getButtonClass = (button, index) => {
    const buttonColor = colors.filter(e => (e.includes(button.classType || 'primary')))

    return [['action-button mt-1 space-y-2 text-gray-600/80 py-2 px-3 w-full cursor-pointer'],
        {
            'opacity-50': isDisabled(button),
            '!cursor-not-allowed': isDisabled(button)
        },
        buttonColor,
    ]
}

</script>

<template>
    <div class="flex">
        <template
            v-for="(button, index) in buttons"
            :key="index">
            <!-- Button with action -->
            <span v-if="show(button) && isTypeButton(button)">
                <button
                    :class="getButtonClass(button, index)"
                    :onClick="() => click(button, data)">
                    <svg-icon
                        type="mdi"
                        size="25"
                        :path="button.icon" />
                </button>
            </span>

            <!-- Divider type for divide buttons group -->
            <span
                v-if="button.type == 'divider'"
                class="border-r h-full sn-divider border-gray-200 pr-3 mr-3">
                <button class="h-full" />
            </span>
        </template>
    </div>
</template>
