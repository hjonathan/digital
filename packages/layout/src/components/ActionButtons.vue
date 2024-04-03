<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import Spinner from './Spinner.vue'
import { show, isDisabled, click } from '../utils/buttons'

const props = defineProps({
    items: Array
})

const colors = [
    'bg-primary-50',
    'bg-yellow-10',
    'bg-sky-50',
    'bg-teal-10',
    'bg-warning-50',
    'bg-pink-50',
    'bg-red-50',
    'border-primary-600',
    'border-yellow-400',
    'border-sky-600',
    'border-teal-600',
    'border-warning-600',
    'border-pink-600',
    'border-red-600',
    'hover:bg-primary-100',
    'hover:bg-yellow-50',
    'hover:bg-sky-100',
    'hover:bg-teal-50',
    'hover:bg-warning-100',
    'hover:bg-pink-100',
    'hover:bg-red-100',
    'hover:text-primary-600',
    'hover:text-yellow-500',
    'hover:text-sky-600',
    'hover:text-teal-600',
    'hover:text-warning-600',
    'hover:text-pink-600',
    'hover:text-red-600',
]

const pulseColors = {
    primary: 'bg-primary-500',
    yellow: 'bg-yellow-500',
    sky: 'bg-sky-500',
    teal: 'bg-teal-500',
    warning: 'bg-warning-500',
    pink: 'bg-pink-500',
    red: 'bg-red-500'
}

/**
 * Gets the color of the spinner assigned to a button.
 * @param {*} button List item to get the color of your spinner.
 */
const getSpinnerColor = (button) => {
    const color = colors.filter(e => e.includes(button.spinnerColor || button.classType || 'primary'))

    color.push({ 'text-grey-600': isDisabled(button) })

    return color.join(' ')
}

/**
 * Gets the classes defined based on the configuration of the list item.
 * @param {*} button Element of the list from which the classes will be extracted.
 */
const getButtonClass = (button, index) => {
    const buttonColor = colors.filter(e => (e.includes(button.classType || 'primary')))

    return [['border-t-[3px] space-y-2 text-gray-600/80 py-2 px-3 w-full cursor-pointer'],
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
            v-for="(button, index) in props.items"
            :key="index">
            <div v-if="show(button)"
                v-permission="{ name: button?.permission}"
                class="relative flex justify-center max-w-[70px] min-w-[70px]">
                <!--
                    TODO:
                    Commented out to find a different solution later for the jumping counters on the top of the buttons.
                    Can not be used if the table actions scroll to the top and remain sticky there.
                    Sticky table actions is the default behaviour for all tables.
                 -->
                <div
                    v-if="button.counter"
                    class="absolute bottom-5 right-0 animate-bounce flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-rose-500 rounded-full z-20">
                    {{ button.counter }}
                </div>

                <a
                    :id="button.label?.replace(/\ /gm, '')"
                    @click.prevent="() => !isDisabled(button) && click(button)"
                    :class="getButtonClass(button, index)">
                    <div class="flex justify-center items-center relative">
                        <svg-icon
                            v-if="!button.spinner"
                            type="mdi"
                            :path="button.icon"
                            size="24"
                            class="" />

                        <span v-if="button.pulse && !isDisabled(button)" :class="`animate-ping duration-1000 absolute h-10 w-10 rounded-full ${pulseColors[button.classType]} opacity-75`"></span>
                        <span v-if="button.pulse && !isDisabled(button)" class="absolute inline-flex rounded-full h-10 w-10 bg-transparent"></span>

                        <Spinner
                            v-if="button.spinner"
                            :color='getSpinnerColor(button)'
                            class="inline-flex w-7 h-7 ml-2"/>
                    </div>

                    <div class="flex justify-center text-center text-[10px]">
                        {{ $t(button.label) }}
                    </div>
                </a>
            </div>
        </template>
    </div>
</template>

<style scoped>
.bg-yellow-10 {
    --tw-bg-opacity: 0.4;
    background-color: rgb(254 252 232 / var(--tw-bg-opacity));
}

.bg-teal-10 {
    --tw-bg-opacity: 0.5;
    background-color: rgb(240 253 250 / var(--tw-bg-opacity));
}
</style>
