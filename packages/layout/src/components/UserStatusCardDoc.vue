<script setup>
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiAccount } from '@mdi/js'
import { Badge } from 'layout'

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
    <div :class="['grid grid-cols-12 space-x-4 border-2 !gap-2 border-l-2 w-full', containerClass()]">
        <!-- Left side -->
        <div class="col-span-4 flex flex-col justify-start items-center space-y-1 pt-2">
            <img v-if="data.url"
                class="h-[46px] w-[46px] rounded-full bg-gray-50"
                :src="data.url" />

            <span
                v-if="!data.url"
                class="inline-flex h-12 w-12 items-center rounded-full  justify-center bg-gray-200 text-gray-500">
                    <svg-icon type="mdi" :path="mdiAccount" size="30"></svg-icon>
            </span>

            <!-- Data status -->
            <dd class="w-min">
                <Badge
                    :type="data.statusColor"
                    :label="data.status" />
            </dd>

            <!-- Date -->
            <div class="truncate text-[10px] leading-3 text-gray-500 pb-2">
                {{ data.date }}
            </div>
        </div>

        <!-- Right  side -->
        <div class="col-span-8 flex flex-col justify-start py-2">
            <slot name="rightside">
                <!-- Name -->
                <div class="font-bold text-gray-900">
                    {{ data.name }}
                </div>

                <!-- Role and department -->
                <div class="text-xs leading-4 text-gray-400 truncate">
                    {{ data.role }} {{ data.department ? '/' : '' }} {{ data.department }}
                </div>

                <!-- Email and phone -->
                <div class="text-xs leading-4 text-gray-400">
                    {{ data.email }} {{ data.phone ? '/' : '' }} {{ data.phone }}
                </div>

                <!-- Note -->
                <div v-if="data.note" class="text-xs leading-4 mt-3">
                    <div class="flex gap-2">
                        <span class="font-bold">
                            {{ $t('Note:') }}
                        </span>

                        <p class="!my-0 line-clamp-3">
                            {{ data.note }}
                        </p>
                    </div>
                </div>
            </slot>
        </div>
    </div>
</template>
