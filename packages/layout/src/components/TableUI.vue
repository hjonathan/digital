<script setup>
import { _ } from 'lodash'
import { defineModel } from 'shared'
import { gsap } from 'gsap'
import { NoItemsFound } from 'layout'

const props = defineProps({
    id: {
        type: String,
        default: null
    },
    // Columns for headers table
    columns: {
        type: Array,
        default: () => ([])
    },
    // Class for all header columns
    headerClass: {
        type: String,
        default: ''
    },
    // Data for rows
    data: {
        type: Array,
        default: () => ([])
    },
    // Allow multiple row opened
    multipleOpen: {
        type: Boolean,
        default: false
    },
    showFooter: {
        type: Boolean,
        default: true
    },
    showHeader: {
        type: Boolean,
        default: true
    },
})

const dataModel = defineModel('data')
const animationTime = 0.5

// Gets alignments for default rows without slots
const getAlignmentClass = (header) => {
    if (header.align === 'left') return '!text-left'

    if (header.align === 'center') return '!text-center'

    if (header.align === 'right') return '!text-right'
}

// Start animation for open row expansible
const animationOpen = (selector) => {
    gsap.fromTo(selector, {
        height: 0,
        zIndex: 0
    },
    {
        height: 'auto',
        duration: animationTime
    })
}
// Star animation for close row expansible
const animationClose = (selector, onComplete) => {
    // Gets height for element to will close
    const height = selector.includes('#')
        ? document.getElementById(selector.replace('#', '')).clientHeight
        : document.getElementsByClassName(selector.replace('.', ''))[0]?.clientHeight || 'auto'

    gsap.fromTo(selector,
        {
            height,
            zIndex: 99999
        },
        {
            height: 0,
            duration: animationTime,
            onComplete
        })
}

// Call to open and close row expansible
const toggleExpansion = (rowIndex) => {
    const openSelector = `expansible-${rowIndex}`

    if (!props.multipleOpen) {
        const openExpansibles = document.getElementsByClassName('expansion-opened')

        if (openExpansibles.length) {
            animationClose('.expansion-opened', () => {
                for (const expanded of openExpansibles) {
                    if (expanded.attributes.index.value !== rowIndex.toString()) {
                        dataModel.value[expanded.attributes.index.value].isOpen = false

                        expanded.classList.remove('expansion-opened')
                    }
                }
            })
        }
    }

    // If row is closed open the row expansible
    if (!dataModel.value[rowIndex].isOpen) {
        dataModel.value[rowIndex].isOpen = true

        animationOpen(`#${openSelector}`)

        document.getElementById(openSelector).classList.add('expansion-opened')

        return
    }

    // If row is opened, close the row expansible
    animationClose(`#${openSelector}`, () => {
        document.getElementById(openSelector).classList.remove('expansion-opened')

        dataModel.value[rowIndex].isOpen = false
    })
}

defineExpose({ toggleExpansion })
</script>

<template>
    <div class="">
        <!-- Table -->
        <table class="global-table table w-full table-without-borders">
            <!-- Header columns -->
            <thead
                v-show="showHeader"    
                :class="headerClass">
                <tr>
                    <th v-for="(header, index) of columns"
                        v-permission="{name: header.permission}"
                        :key="index"
                        :class="`head-width ${header.customClass} ${getAlignmentClass(header)}`">
                        {{ header.name }}
                    </th>
                </tr>
            </thead>

            <!-- Tbody for all rows -->
            <tbody
                v-for="(row, index) of dataModel"
                :key="index"
                class="mt-5 border-b border-gray-200">
                <slot
                    name="row"
                    :row="row"
                    :index="index"
                    :toggleExpansion="toggleExpansion">
                    <tr>
                        <td
                            v-for="(header, index) of columns"
                            :key="index"
                            :class="`px-2 ${getAlignmentClass(header)}`">
                            {{ _.get(row, header.field)}}
                        </td>
                    </tr>
                </slot>

                <!-- Slot for expansible row -->
                <tr
                    v-show="row.isOpen"
                    class="border-none">
                    <td colspan="100%" style="padding: 0 !important;">
                        <div
                            :id="`expansible-${index}`"
                            :index="index"
                            :class="['overflow-hidden', {'expansion-opened': row.isOpen}]">
                            <slot
                                name="row-expansible"
                                :row="row"
                                :index="index"
                                :toggleExpansion="toggleExpansion"/>
                        </div>
                    </td>
                </tr>
            </tbody>

            <tbody v-if="$slots['total'] && showFooter">
                <slot name="total"></slot>
            </tbody>

            <tbody v-if="!dataModel.length">
                <tr>
                    <td colspan="100%">
                        <NoItemsFound />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style>
 .global-table {
    @apply !w-min;
    @apply w-full;
    table-layout: auto;
 }

.global-table > tbody > tr > td, .global-table > thead > tr > th {
    @apply !px-20;
    @apply sm:!px-8;
    @apply md:!px-5;
    @apply w-auto;

    @apply max-w-[400px];
    @apply w-[400px];
    @apply !max-w-max;
}

td.align-tems-end {
    @apply flex;
    @apply flex-row;
    @apply justify-end;
    @apply text-right;
    @apply items-end;

    @apply !pr-[0%];
    @apply sm:!pr-[10%];
    @apply md:!pr-[15%];
    @apply lg:!pr-[20%];
    @apply xl:!pr-[25%];
    @apply 2xl:!pr-[30%];

    text-wrap: wrap !important;
}
</style>
