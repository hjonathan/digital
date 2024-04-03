<script setup>
import { EntityInformation, Title } from 'layout'
import { formatDate } from 'shared'

defineProps({
    title: String,
    actionLabel: String,
    printViewId: [String, Number],
    printViewExtraId: [String, Number],
    printViewTitle: String,
    date: [Date, String],
    actionLabelType: {
        type: String,
        default: 'default'
    }
})
</script>

<template>
    <div class="flex justify-between">
        <div class="self-end">
            <!-- Displayed only in the nagevator view -->
            <div class="notPrintableArea flex flex-row items-end mb-1">
                <Title
                    :title="title"
                    :has-border-bottom-line="false"
                    class="!py-0" />

                <span
                    v-if="actionLabel"
                    :class="{
                        'text-gray-400' : actionLabelType === 'default',
                        'text-success-600' : actionLabelType === 'success',
                        'text-red-600' : actionLabelType === 'danger',
                    }"
                    class="text-base/7 ml-2 font-semibold flex flex-row shrink-0">
                    {{ $t(actionLabel) }}
                </span>
            </div>

            <!-- Only shown in print-->
            <div class="justForPrintView">
                <h1 class="!my-0 text-gray-900 text-lg font-semibold w-full">
                    {{ printViewTitle }} #

                    <span v-if="printViewId">
                        {{ printViewId }}
                    </span>
                </h1>

                <span>
                    {{ printViewExtraId }}
                </span>
            </div>

            <div class="leading-none">
                {{ formatDate(date, 'americanFormat') }}
            </div>
        </div>

        <!-- Company logo -->
        <EntityInformation
            informationClasses="custom-text-size"
            title="Company Name"
            :data="{
                address:'300 N. Main street',
                state:'Monroe, OH 45050',
                phone:'513-506-1857'
            }"
            logo="https://tailwindui.com/img/logos/mark.svg?color=indigo&amp;shade=600" />
    </div>
</template>
