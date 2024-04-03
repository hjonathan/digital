<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiFileDocument } from '@mdi/js'

const props = defineProps({
    data: Object,
    status: String
})

const statusClass = () => {
    return props.data.statusClass || 'text-gray-700 ring-gray-600/20'
}

const containerClass = () => {
    return props.data.containerClass || 'border-l-teal-500'
}
</script>

<template>
    <div :class="['p-2 !pt-2 grid grid-cols-12 space-x-4 border-2 border-l-2', containerClass()]">
        <!-- Left side -->
        <div class="col-span-3 flex flex-col justify-start items-center space-y-1 pt-2">
            <!-- Data status -->
            <dd>
                <span
                    :class="['inline-flex items-center rounded-full w-min px-2 py-1 text-xs font-medium ring-1 ring-inset mt-[9px]', statusClass()]">
                    {{ data.status }}
                </span>
            </dd>

            <!-- Date -->
            <div class="truncate text-[10px] leading-3 text-gray-500">
                {{ data.date }}
            </div>
        </div>

        <!-- Right  side -->
        <div class="col-span-7 flex flex-col justify-start pt-2">
            <!-- Name -->
            <div class="font-bold text-gray-900">
                {{ data.name }}
            </div>

            <!-- Role and department -->
            <div class="text-xs leading-4 text-gray-400">
                {{ data.role }}
            </div>

            <!-- Email and phone -->
            <div class="text-xs leading-4 text-gray-400">
                {{ data.email }} / {{ data.phone }}
            </div>

            <!-- Note -->
            <div class="text-xs leading-4 mt-3">
                <div class="flex gap-2">
                    <span class="font-bold">
                        {{ $t('Note:') }}
                    </span>

                    {{ data.note }}
                </div>
            </div>
        </div>

        <div class="col-span-2 flex items-center">

            <a href="#" @click="data.onClick? data.onClick() : null"
                class="inline-flex tooltip h-12 w-12 items-center rounded-full justify-center text-gray-400">
                    <svg-icon type="mdi" :path="mdiFileDocument" size="30"></svg-icon>
            </a>
        </div>
    </div>
</template>
